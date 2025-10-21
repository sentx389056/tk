import { Award, Building2, Mail, Phone, User, Users } from "lucide-react";
import { Avatar } from "./ui/avatar";

interface ManagementCardProps {
   name: string;
   jobTitle: string;
   place: string;
   experience: string;
   mail: string;
   phone: string;
   biography: string;
   education: string;
   achievements: string[];
   reverse: boolean;
}

export default function ManagementCard({name, jobTitle, place, mail, phone, experience, biography, education, achievements, reverse}: ManagementCardProps ) {
   return (
      <div className="flex flex-col sm:flex-row gap-8 w-full">
         <div className="w-full sm:max-w-md bg-blue-light border-1 rounded-md p-7">
            <div className=" flex flex-col items-center">
               <Avatar className="bg-red-pink flex justify-center h-24 w-24 mb-4 border-2 border-white shadow-lg">
                  <Users size={32} color="#FFF" className="self-center" />
               </Avatar>
               <h2 className="font-bold text-lg mb-2">{name}</h2>
               <p className="font-medium font-sm mb-1">{jobTitle}</p>
               <p className="text-xs text-gray-500 mb-6">{place}</p>
            </div>
            <div className="flex flex-col gap-3">
               <div className="flex gap-3 items-center text-xs text-gray-500">
                  <Mail size={16} color="#CC4E3A" />{mail}
               </div>
               <div className="flex gap-3 items-center text-xs text-gray-500">
                  <Phone size={16} color="#CC4E3A" />{phone}
               </div>
               <div className="flex gap-3 items-center text-xs text-gray-500">
                  <Award size={16} color="#CC4E3A" />Опыт: {experience}
               </div>
            </div>
         </div>
         <div className={` bg-white border-1 rounded-md p-7  ${reverse? "sm:order-first" : ""}`}>
            <div className="flex gap-2 items-center mb-3">
               <User size={20} color="#CC4E3A" />
               <p className="font-semibold text-base">Биография</p>
            </div>
            <p className="text-sm text-gray-500">{biography}</p>
            <div className="flex gap-2 items-center mb-3 mt-6">
               <Building2 size={20} color="#CC4E3A" />
               <p className="font-semibold text-base">Образование</p>
            </div>
            <p className="text-sm text-gray-500">{education}</p>
            <div className="flex gap-2 items-center mb-3 mt-6">
               <Award size={20} color="#CC4E3A" />
               <p className="font-semibold text-base">Достижения и награды</p>
            </div>
            <ul className="list-none">
               {achievements.map((achievement, index) => (
                  <li key={index} className="text-gray-700 text-sm mb-2  before:content-['•'] before:text-red-pink before:mr-2 before:float-left">
                     {achievement}
                  </li>
               ))}
            </ul>
         </div>
      </div>
   )
}