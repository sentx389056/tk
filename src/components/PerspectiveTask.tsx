interface PerspectiveTasksProps {
   number: number;
   text: string;
}

export default function PerspectiveTask({ number, text }: PerspectiveTasksProps) {
   return (
      <div className="flex items-center bg-blue-light py-5 px-5 rounded-md text-sm text-gray-700 w-full">
         <div className="relative p-4 rounded-full bg-red-pink mr-3">
            <span className="absolute space-x-1 text-amber-50 text-base translate-[-50%]">{number}</span>
         </div>
         {text}
      </div>
   )
}