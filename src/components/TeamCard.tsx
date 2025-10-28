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
      <Card className="w-full h-full flex flex-col">
         <CardHeader className="flex-1">
            <Avatar className="bg-red-pink flex justify-center h-14 sm:h-16 w-14 sm:w-16 mb-3 sm:mb-4 border-2 border-white shadow-lg">
               <Users size={28} color="#FFF" className="self-center" />
            </Avatar>
            <CardTitle className="text-lg sm:text-xl break-words">{name}</CardTitle>
            <CardDescription className="flex gap-2 flex-col mt-2">
               <p className="text-black font-medium text-sm sm:text-base">{position}</p>
               {organization && (
                  <div className="flex gap-2 items-start mt-2">
                     <Building2 size={16} className="flex-shrink-0 mt-1" />
                     <span className="text-sm">{organization}</span>
                  </div>
               )}
               {experience && (
                  <div className="flex gap-2 items-start">
                     <Award size={16} className="flex-shrink-0 mt-1" />
                     <span className="text-sm">Опыт: {experience}</span>
                  </div>
               )}
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Separator className="my-4 bg-gray-500 h-[1px] opacity-15" />
         </CardContent>
         <CardFooter className="flex flex-col gap-3 text-gray-500">
            {email && (
               <div className="flex gap-2 items-center self-start">
                  <Mail size={16} color="#CC4E3A" className="flex-shrink-0" />
                  <span className="text-xs sm:text-sm break-all">{email}</span>
               </div>
            )}
            {phone && (
               <div className="flex gap-2 items-center self-start">
                  <Phone size={16} color="#CC4E3A" className="flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{phone}</span>
               </div>
            )}
         </CardFooter>
      </Card>
   )
}