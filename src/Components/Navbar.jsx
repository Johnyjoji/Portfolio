import  {useState} from 'react'
function Navbar(){
    const pages=[
        {name:"Home",path:'#'},
        {name:"About",path:'#about'},
        {name:"Projects",path:'#projects'},
        {name:"Contact",path:'#contact'}
    ];

    const [isVisible,setIsVisible] = useState(false);

    const clickhandle = () => setIsVisible(!isVisible);
    // const itemclick = () => setIsVisible(false);


    return(
        <div className="fixed inset-x-0 top-0 z-20 flex h-[3em] items-center justify-between border-b border-[#252d3a] bg-[#181f2a]/85 px-4 backdrop-blur-xl select-none">
            <div onMouseEnter={clickhandle} onMouseLeave={clickhandle} className='relative'>
                <button className="border border-transparent
                                hover:bg-slate-600 transition  rounded-full 
                                p-5 py-1 font-emerland text-xl relative cursor-pointer" >
                    Menu
                    
                </button>
                {isVisible &&(
                    <div className='h-fit w-fit p-4 bg-blue-950 absolute top-full left-0 rounded-2xl transition'>
                        <ul className='flex gap-2 flex-col'>
                        {pages.map((page,index)=>(
                                <li key={index}>
                                    <a className='text-white h-full w-full' href={page.path} >
                                        <div className=" hover:bg-blue-900 rounded-xl px-3 py-1">
                                            {page.name}
                                        </div>
                                    </a>
                                </li>
                        ))}
                        </ul>
                    </div>
                )}
            </div>
            <a href="#" className="font-nagasaki scroll-smooth text-3xl -mb-2">JOHNY JOJI<span className="text-slate-400">.dev</span></a>
            <button>dark</button>

        </div>
    );
}

export default Navbar