export default function LastEvents({ title, description, date }: { title: string; description: string; date?: string }) {
   return (
      <li className="pl-4 border-l-3 border-red-pink">
         <h3 className="mb-1 font-semibold">{title}</h3>
         <p className="text-gray-500 text-sm mb-2">{description}</p>
         <p className="text-gray-500 text-xs mb-4">{date}</p>
      </li>
   );
}