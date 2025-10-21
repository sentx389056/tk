import { Input } from "./ui/input";

export default function SearchInput() {
   return (
      <div className="shadow-md w-full h-30 p-5 rounded-md mt-15">
         <div className="grid items-center gap-6">
            <Input
               type="text"
               placeholder="Поиск по названию"
               className="h-10 w-full border  rounded-md focus:outline-none"
            />
         </div>
         <p className="text-gray-500 text-xs mt-3">Найдено: 6</p>
      </div>
   )
}