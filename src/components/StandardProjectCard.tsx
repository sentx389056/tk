import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Download, FileText } from "lucide-react";

type StandardProjectCardProps = {
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    fileUrl?: string;
}

export default function ProjectCard({ title, description, startDate, endDate }: StandardProjectCardProps) {
    const startDateFormatted = startDate.toLocaleDateString('ru-RU');
    const endDateFormatted = endDate.toLocaleDateString('ru-RU');
    return (
        <Card className="w-full px-6">
            <CardHeader className="p-0">
                <div className="flex gap-3 flex-col">
                    <div className="flex gap-3 items-center mb-7">
                        <FileText size={32} color="#CC4E3A" className="hidden sm:flex" />
                        <div className="flex flex-col">
                            <CardTitle className="mb-3">{title}</CardTitle>
                            <CardDescription className="text-gray-500">
                                {description}
                            </CardDescription>
                        </div>
                    </div>

                </div>
                <CardAction>
                    <Button type="submit" className="w-full bg-red-pink font-medium cursor-pointer"><Download size={16} /><span className="hidden sm:flex">Скачать проект</span></Button>
                </CardAction>
            </CardHeader>
            <CardContent className="p-0 flex items-center gap-30 flex-wrap sm:flex-nowrap max-sm:gap-4">
                <CardDescription className="text-gray-500 flex gap-2 items-center">
                    <Calendar size={16} />
                    <p>Начало:</p>
                    <p>{startDateFormatted}</p>
                </CardDescription>
                <CardDescription className="text-gray-500 flex gap-2 items-center">
                    <Calendar size={16} />
                    <p>Окончание:</p>
                    <p>{endDateFormatted}</p>
                </CardDescription>
            </CardContent>
        </Card>
    )
}