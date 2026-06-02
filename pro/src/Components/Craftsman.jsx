import { useEffect, useRef, useState } from "react";

const FONT_FAMILY = '"Heather green", serif';
const TEX_WIDTH = 2048;
const TEX_HEIGHT = 512;

function layoutTitleText(ctx, text, width, height) {
  let fontSize = Math.floor(height * 0.52);
  ctx.font = `${fontSize}px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxWidth = width * 0.92;
  while (fontSize > 24 && ctx.measureText(text).width > maxWidth) {
    fontSize -= 4;
    ctx.font = `${fontSize}px ${FONT_FAMILY}`;
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const mainWidth = ctx.measureText(text).width;

  return { fontSize, centerX, centerY, mainWidth };
}

function drawTextTexture(textCtx, text, width, height) {
  textCtx.clearRect(0, 0, width, height);

  const { centerX, centerY } = layoutTitleText(textCtx, text, width, height);

  textCtx.fillStyle = "#ffffff";
  textCtx.fillText(text, centerX, centerY);
}

function measureSubtitleLayout(text, subtitle, width, height) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const { fontSize, centerX, centerY, mainWidth } = layoutTitleText(
    ctx,
    text,
    width,
    height
  );

  let subSize = Math.max(20, Math.floor(fontSize * 0.24));
  ctx.font = `${subSize}px ${FONT_FAMILY}`;

  const subMaxWidth = mainWidth * 0.85;
  while (subSize > 16 && ctx.measureText(subtitle).width > subMaxWidth) {
    subSize -= 2;
    ctx.font = `${subSize}px ${FONT_FAMILY}`;
  }

  const anchorX = centerX + mainWidth / 2;
  const anchorY = centerY + fontSize * 0.34;

  return {
    rightPct: ((width - anchorX) / width) * 100,
    topPct: (anchorY / height) * 100,
    fontSizeRatio: subSize / height,
  };
}

export default function Craftsman({
  text = "Digital Craftsman",
  subtitle,
  className = "",
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [subtitleLayout, setSubtitleLayout] = useState(null);
  const [subtitleFontSize, setSubtitleFontSize] = useState(0);

  useEffect(() => {
    if (!subtitle) {
      setSubtitleLayout(null);
      return;
    }

    let cancelled = false;

    const updateLayout = async () => {
      try {
        await document.fonts.load(`140px ${FONT_FAMILY}`);
      } catch {
        /* use fallback if custom font is unavailable */
      }
      if (cancelled) return;

      const layout = measureSubtitleLayout(
        text,
        subtitle,
        TEX_WIDTH,
        TEX_HEIGHT
      );
      setSubtitleLayout(layout);

      const height = containerRef.current?.getBoundingClientRect().height;
      if (layout && height) {
        setSubtitleFontSize(layout.fontSizeRatio * height);
      }
    };

    updateLayout();

    const container = containerRef.current;
    if (!container) return () => { cancelled = true; };

    const resizeObserver = new ResizeObserver(() => {
      const layout = measureSubtitleLayout(
        text,
        subtitle,
        TEX_WIDTH,
        TEX_HEIGHT
      );
      if (!layout) return;
      setSubtitleLayout(layout);
      const height = container.getBoundingClientRect().height;
      setSubtitleFontSize(layout.fontSizeRatio * height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
    };
  }, [text, subtitle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(
      vertexShader,
      `
      attribute vec2 position;
      uniform float uAspect;
      uniform float uTexAspect;
      varying vec2 vUv;
      void main() {
        vUv = vec2(position.x * 0.5 + 0.5, 1.0 - (position.y * 0.5 + 0.5));
        vec2 pos = position;
        if (uAspect > uTexAspect) {
          pos.x *= uTexAspect / uAspect;
        } else {
          pos.y *= uAspect / uTexAspect;
        }
        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `
    );
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(
      fragmentShader,
      `
      precision mediump float;
      uniform sampler2D uTexture;
      uniform vec2 uOffset;
      uniform vec3 uColor;
      varying vec2 vUv;

      void main() {
        vec2 distortedUv = vUv + vec2(uOffset.x, -uOffset.y);
        vec4 texel = texture2D(uTexture, distortedUv);
        gl_FragColor = vec4(uColor * texel.a * 1.5, texel.a);
      }
    `
    );
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");
    textCanvas.width = TEX_WIDTH;
    textCanvas.height = TEX_HEIGHT;

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const textureLocation = gl.getUniformLocation(program, "uTexture");
    const offsetLocation = gl.getUniformLocation(program, "uOffset");
    const colorLocation = gl.getUniformLocation(program, "uColor");
    const aspectLocation = gl.getUniformLocation(program, "uAspect");
    const texAspectLocation = gl.getUniformLocation(program, "uTexAspect");
    const texAspect = textCanvas.width / textCanvas.height;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const updateTexture = () => {
      drawTextTexture(textCtx, text, textCanvas.width, textCanvas.height);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        textCanvas
      );
    };

    const render = () => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      const offsetAmount = 0.005;
      const channels = [
        { color: [1, 0, 0], offset: [offsetAmount, 0] },
        { color: [0, 1, 0], offset: [0, 0] },
        { color: [0, 0, 1], offset: [-offsetAmount, 0] },
      ];

      channels.forEach(({ color, offset }) => {
        gl.uniform2fv(offsetLocation, offset);
        gl.uniform3fv(colorLocation, color);
        gl.uniform1i(textureLocation, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });
    };

    const setCanvasSize = () => {
      const { width, height } = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(width * dpr));
      const h = Math.max(1, Math.floor(height * dpr));

      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      gl.viewport(0, 0, w, h);
      gl.uniform1f(aspectLocation, w / h);
      gl.uniform1f(texAspectLocation, texAspect);
      render();
    };

    let cancelled = false;

    const init = async () => {
      try {
        await document.fonts.load(`140px ${FONT_FAMILY}`);
      } catch {
        /* use fallback if custom font is unavailable */
      }
      if (cancelled) return;
      updateTexture();
      setCanvasSize();
    };

    init();

    const resizeObserver = new ResizeObserver(setCanvasSize);
    resizeObserver.observe(container);
    window.addEventListener("resize", setCanvasSize);

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      window.removeEventListener("resize", setCanvasSize);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
      gl.deleteTexture(texture);
    };
  }, [text]);

  const label = subtitle ? `${text}, ${subtitle}` : text;

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${className}`}
      aria-label={label}
      role="img"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {subtitle && subtitleLayout ? (
        <p
          aria-hidden="true"
          className="pointer-events-none absolute font-heather whitespace-nowrap text-yellow-200"
          style={{
            right: `${subtitleLayout.rightPct}%`,
            top: `${subtitleLayout.topPct}%`,
            fontSize: subtitleFontSize,
            lineHeight: 1,
          }}
        >
          {subtitle}
        </p>
      ) : null}
      <span className="sr-only">{label}</span>
    </div>
  );
}
