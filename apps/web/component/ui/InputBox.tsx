

type InputProps = {
    heading?:string,
    placeholder:string,
    type:string
    reference?:any;
}

export default function InputBox({heading,placeholder,type,reference}:InputProps){
    return <div>
        {heading && 
        <div>
            {heading}
        </div> }
        <div>
            <input ref={reference} placeholder={placeholder} required type={type} className="border-1 border-gray-300 rounded-md px-4 py-2 text-left w-full" ></input>
        </div>
    </div>
}