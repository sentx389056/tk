import Contacts from "@/components/Contacts";
import Map from "@/components/Map";
import PDFViewerProvision from "@/components/PDFViewerProvision";

export default function ActivityPage() {

    const activity = [
        {
            id: 1,
            fileUrl: "/api/files/activity/26.02.2026.Повестка_Заседания__ТК_015.pdf",
        },
    ]

    return (
        <main className="flex flex-col w-full px-5 xl:px-40 py-10">
            <div className="py-10">
                <div className="flex flex-col items-center">
                    <h1 className="text-4xl font-bold text-center mb-2 max-sm:text-2xl">Деятельность</h1>
                </div>
                <div className="flex flex-col sm:flex-row mt-16 gap-6">
                    {activity.map(order => (
                        <PDFViewerProvision
                            key={order.id}
                            fileUrl={order.fileUrl}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}