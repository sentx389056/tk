import { Award, Building2, Mail, Phone, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import  Image  from "next/image"

interface TeamCardProps {
   name: string;
   jobTitle: string;
   place: string;
   experience: string;
   mail: string;
   phone: string
}

export default function TeamCard({ name, jobTitle, place, experience, mail, phone }: TeamCardProps) {
   return (
      <Card className="w-full">
         <CardHeader>
            <div>
               <Image width={56} height={56} src="https://github.com/shadcn.png" alt="user_avatar.png" className="rounded-full" />
            </div>
            <CardTitle>{name}</CardTitle>
            <CardDescription className="flex gap-2 flex-col">
               <p className="text-black font-medium mt-2">{jobTitle}</p>
               <div className="flex gap-2 mt-3">
                  <Building2 size={16} />{place}
               </div>
               <div className="flex gap-2">
                  <Award size={16} />Опыт: {experience}
               </div>
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Separator className="mt-6 bg-gray-500 h-[1] opacity-15" />
         </CardContent>
         <CardFooter className="flex flex-col gap-2 text-gray-500 text-xs">
            <div className="flex gap-2 self-start">
               <Mail size={16} color="#CC4E3A" />{mail}
            </div>
            <div className="flex gap-2 text-gray-500 self-start">
               <Phone size={16} color="#CC4E3A" />{phone}
            </div>
         </CardFooter>
      </Card>
   )
}