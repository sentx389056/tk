import { Award, Building2, Mail, Phone, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import Image from "next/image"
import { Avatar } from "./ui/avatar";

interface TeamCardProps {
   name: string;
   email: string;
   position: string;
   organization: string;
   phone: string;
   experience: string;
}

export default function TeamCard({ name, email, position, experience, phone, organization }: TeamCardProps) {
   return (
      <Card className="w-full">
         <CardHeader>
            <Avatar className="bg-red-pink flex justify-center h-18 w-18 mb-4 border-2 border-white shadow-lg">
               <Users size={32} color="#FFF" className="self-center" />
            </Avatar>
            <CardTitle>{name}</CardTitle>
            <CardDescription className="flex gap-2 flex-col">
               <p className="text-black font-medium mt-2">{position}</p>
               {(organization) && (
                  <div className="flex gap-2 mt-3">
                     <Building2 size={16} />{organization}
                  </div>
               )}
               {(experience) && (
                  <div className="flex gap-2">
                     <Award size={16} />Опыт: {experience}
                  </div>
               )}
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Separator className="mt-6 bg-gray-500 h-[1] opacity-15" />
         </CardContent>
         <CardFooter className="flex flex-col gap-2 text-gray-500 text-xs">
            {(email) && (
               <div className="flex gap-2 self-start">
                  <Mail size={16} color="#CC4E3A" />{email}
               </div>
            )}
            {(phone) && (
               <div className="flex gap-2 text-gray-500 self-start">
                  <Phone size={16} color="#CC4E3A" />{phone}
               </div>
            )}
         </CardFooter>
      </Card>
   )
}