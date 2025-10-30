import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface TeamCardProps {
    name: string;
    position: string;
    organization: string;
    email: string;
    phone: string;
    address: string
}

export default function MemberCard({ name, position, organization, email, phone, address }: TeamCardProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription className="flex gap-2 flex-col text-black">
                    <p className="text-black font-medium mt-2">{position}</p>
                    <div>
                        Организация: {organization}
                    </div>
                    <div>
                        Email: {email}
                    </div>
                    <div>
                        Адрес: {address}
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