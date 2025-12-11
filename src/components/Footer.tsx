import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Separator } from "./ui/separator";

export default function Footer() {

   const currentYear = new Date().getFullYear();

   return (
      <footer className="bg-black py-8 xl:px-20 text-white" style={{ color: 'white' }}>
         <div className="mx-auto px-3 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-15 container">
            <div>
               <h2 className="text-white mb-6 font-bold" style={{ color: 'white' }}>ТК015 &quot;Кинематография&quot;</h2>
               {/* <span className="text-gray-500 text-sm">ТК NNN</span> */}
               <ul className="flex gap-3 flex-col mt-2 text-sm mb-3">
                  <li className="flex items-center gap-2">
                     <MapPin color="#6a7282" size={18} />
                     <span className="text-gray-500 max-w-sm" style={{ color: '#d1d5db' }}>142050, Московская область, г.Домодедово, мкр. Белые столбы, тер. Госфильмофонд, стр. 8</span>
                  </li>
                  <li className="flex gap-2">
                     <Phone color="#6a7282" size={18} />
                     <div className="flex flex-col gap-2">
                        <span className="text-gray-500" style={{ color: '#d1d5db' }}>+7 (499) 941-06-80 (доб. 4-241)</span>
                        <span className="text-gray-500" style={{ color: '#d1d5db' }}>+7 (499) 941-06-80 (доб. 12-10)</span>
                     </div>
                  </li>
                  <li className="flex items-center gap-2">
                     <Mail color="#6a7282" size={18} />
                     <a href="mailto:tk015@gff-rf.ru" className="text-gray-500" style={{ color: '#d1d5db' }}>tk015@gff-rf.ru</a>
                  </li>
               </ul>
            </div>
            <div>
               <h2 className="text-white mb-2 font-bold" style={{ color: 'white' }}>Навигация</h2>
               <nav>
                  <ul className="flex flex-col gap-3">
                     {/* <li>
                        <Link href="/" className="text-gray-500 text-sm">Главная</Link>
                     </li> */}
                     {/* <li>
                        <Link href="/team" className="text-gray-500 text-sm">Состав ТК</Link>
                     </li> */}
                     {/* <li>
                        <Link href="/management" className="text-gray-500 text-sm">Руководство</Link>
                     </li> */}
                     {/* <li>
                        <Link href="/standards" className="text-gray-500 text-sm">Фонд стандартов закрепленных за ТК</Link>
                     </li> */}
                     {/* <li>
                        <Link href="/meetings" className="text-gray-500 text-sm">Заседания</Link>
                     </li>
                     <li>
                        <Link href="/protocols" className="text-gray-500 text-sm">Протоколы</Link>
                     </li>
                     <li>
                        <Link href="/reports" className="text-gray-500 text-sm">Годовые отчеты</Link>
                     </li> */}
                     <li>
                        <Link href="/provisions" className="text-gray-500 text-sm" style={{ color: '#d1d5db' }}>Приказ о создании ТК</Link>
                     </li>
                     <li>
                        <Link href="/perspective" className="text-gray-500 text-sm" style={{ color: '#d1d5db' }}>Перспективная программа</Link>
                     </li>
                     <li>
                        <Link href="/projects" className="text-gray-500 text-sm" style={{ color: '#d1d5db' }}>Перечни стандартов</Link>
                     </li>
                     <li>
                        <Link href="/applications" className="text-gray-500 text-sm" style={{ color: '#d1d5db' }}>Поступившие заявки на участие в ТК</Link>
                     </li>
                     <li>
                        <Link href="/news" className="text-gray-500 text-sm" style={{ color: '#d1d5db' }}>Новости</Link>
                     </li>
                     <li>
                        <Link href="/contacts" className="text-gray-500 text-sm" style={{ color: '#d1d5db' }}>Контакты ТК</Link>
                     </li>
                     <li>
                        <Link href="https://gosfilmofond.ru/" target="_blank" className="text-gray-500 text-sm" style={{ color: '#d1d5db' }}>ГОСФИЛЬМОФОНД РОССИИ</Link>
                     </li>
                     {/* <li>
                        <Link href="/login" className="text-gray-500 text-sm">Вход для членов тк</Link>
                     </li> */}
                  </ul>
               </nav>
            </div>
         </div>
         <Separator className="my-4 bg-gray-500" />
         <p className="text-gray-500 text-center text-sm" style={{ color: '#d1d5db' }}>&copy; ТК015 &quot;Кинематография&quot;, {currentYear}г.</p>
      </footer>
   )
}