export default function MainTask({ tasks }: { tasks: string[] }) {
   return (
      <ul className="list-none">
         {tasks.map((task, index) => (
            <li key={index} className="text-gray-700 text-sm mb-2  before:content-['•'] before:text-red-pink before:mr-2 before:float-left">
               {task}
            </li>
         ))}
      </ul>
   );
}
