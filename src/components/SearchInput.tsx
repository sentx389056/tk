import { Input } from "./ui/input";
import { useEffect, useState } from 'react';

type Props = {
   value?: string;
   onChange?: (value: string) => void;
   count?: number;
};

export default function SearchInput({ value, onChange, count }: Props) {
   const [local, setLocal] = useState<string>(value ?? '');

   // keep local in sync when controlled
   useEffect(() => {
      if (typeof value === 'string') setLocal(value);
   }, [value]);

   function handleChange(v: string) {
      if (onChange) onChange(v);
      else setLocal(v);
   }

   return (
      <div className="shadow-md w-full h-30 p-5 rounded-md mt-15">
         <div className="grid items-center gap-6">
            <Input
               type="text"
               value={local}
               onChange={(e) => handleChange(e.target.value)}
               placeholder="Поиск по названию"
               className="h-10 w-full border  rounded-md focus:outline-none"
            />
         </div>
         <p className="text-gray-500 text-xs mt-3">Найдено: {count ?? 0}</p>
      </div>
   );
}