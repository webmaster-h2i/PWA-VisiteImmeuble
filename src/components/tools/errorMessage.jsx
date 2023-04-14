
export default function ErrorMessage({errors}){
    return(
        <div className={errors? "flex justify-center bg-red-500 rounded-lg mb-5  text-sm": "hidden"}>
            <h2 className="text-[color:var(--text-color)] p-5 text-center">{errors}</h2>
        </div>
    )
}