import { Award, Building2, Mail, Phone, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import Image from "next/image"

interface TeamCardProps {
    name: string;
    jobTitle: string;
    organization: string;
    email: string;
    phone: string;
    address: string
}

export default function MemberCard({ name, jobTitle, organization, email, phone, address }: TeamCardProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription className="flex gap-2 flex-col text-black">
                    <p className="text-black font-medium mt-2">{jobTitle}</p>
                    <div>
                        Организация: {organization}
                    </div>
                    <div>
                        Email: {address}
                    </div>
                    <div>
                        Телефон: {phone}
                    </div>
                    <div>
                        Адрес: {address}
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Separator className="h-[1] opacity-15" />
            </CardContent>
        </Card>
    )
}