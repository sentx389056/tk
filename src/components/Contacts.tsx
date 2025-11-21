import { Globe, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function Contacts() {
   return (
      <div className="p-5 bg-blue-light border rounded-lg w-full sm:max-w-md">
         <h2 className="font-bold text-2xl">Основная информация</h2>
         <ul className="max-md: text-sm">
            <li className="flex items-start gap-4 mt-6">
               <MapPin size={24} color="#CC4E3A" />
               <div>
                  <h3 className="font-semibold">Адрес</h3>
                  <p className="max-w-60">142050, Московская область, г.Домодедово, мкр. Белые столбы, тер. Госфильмофонд, стр. 8</p>
               </div>
            </li>
            <li className="flex items-start gap-4 mt-6">
               <Phone size={24} color="#CC4E3A" />
               <div>
                  <h3 className="font-semibold">Телефон</h3>
                  <p>+7 (499) 941-06-80 (доб. 4-241)</p>
                  <p>+7 (499) 941-06-80 (доб. 12-10)</p>
               </div>
            </li>
            <li className="flex items-start gap-4 mt-6">
               <Mail size={24} color="#CC4E3A" />
               <div>
                  <h3 className="font-semibold">Электронная почта</h3>
                  <a href="mailto:chekalin.d@gff-rf.ru">chekalin.d@gff-rf.ru</a>
               </div>
            </li>
            <li className="flex items-start gap-4 mt-6">
               <Globe size={24} color="#CC4E3A" />
               <div>
                  <h3 className="font-semibold">Сайт</h3>
                  <Link href="/">TC_Cinematography</Link>
               </div>
            </li>
            {/* <li className="flex items-start gap-4 mt-6">
               <Clock size={24} color="#CC4E3A" />
               <div>
                  <h3 className="font-semibold">Режим работы</h3>
                  <p>Пн-Пт: 9:00 - 18:00<br />
                     Сб-Вс: выходные
                  </p>
               </div>
            </li> */}
         </ul>
      </div>
   )
}