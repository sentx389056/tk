import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function Contacts() {
   return (
      <div className="p-8 bg-blue-light border rounded-lg w-full sm:max-w-md">
         <h2 className="font-bold text-2xl">Основная информация</h2>
         <ul>
            <li className="flex items-start gap-4 mt-6">
               <MapPin size={24} color="#CC4E3A" />
               <div>
                  <h3 className="font-semibold">Адрес</h3>
                  <p>119021, г. Москва,<br/>ул. Всеволожский пер., д.3</p>
               </div>
            </li>
            <li className="flex items-start gap-4 mt-6">
               <Phone size={24} color="#CC4E3A" />
               <div>
                  <h3 className="font-semibold">Приёмная</h3>
                  <p>+7 (495) 123-45-66</p>
               </div>
            </li>
            <li className="flex items-start gap-4 mt-6">
               <Mail size={24} color="#CC4E3A" />
               <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>info@gosfilmofond.ru</p>
               </div>
            </li>
            <li className="flex items-start gap-4 mt-6">
               <Clock size={24} color="#CC4E3A" />
               <div>
                  <h3 className="font-semibold">Режим работы</h3>
                  <p>Пн-Пт: 9:00 - 18:00<br/>
                     Сб-Вс: выходные
                  </p>
               </div>
            </li>
         </ul>
      </div>
   )
}