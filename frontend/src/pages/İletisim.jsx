import React, { useContext, useState } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';

const Contact = () => {
  const { backendUrl } = useContext(ShopContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
             const response = await axios.post(backendUrl + '/api/user/send-contact-email', {
                name,
                email,
                message,
            });

            if (response.data.success) {
                toast.success('Mesajınız başarıyla gönderildi!');
                setName('');
                setEmail('');
                setMessage('');
            } else {
                toast.error('Mesaj gönderilirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Hata Oluştu:', error);
            toast.error('Mesaj gönderilirken bir hata oluştu.');
        }
    };

    return (
        <section className="mb-32">
            {/* Harita Bölümü */}
            <div className="relative h-[300px] overflow-hidden bg-cover bg-[50%] bg-no-repeat">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3002.9256006883784!2d28.713681412146578!3d41.17978990872591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caaa2bae698f03%3A0xa0dc6eef3e76b222!2zS2FybMSxYmF5xLFyLCBLYXJsxLFiYXnEsXIgQ2QuIE5vOjI4LCAzNDI4MSBBcm5hdXW0a8O2eS_EsHN0YW5idWw!5e0!3m2!1str!2str!4v1728952081182!5m2!1str!2str"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>

            {/* İletişim Formu ve Bilgileri */}
            <div className="px-6 md:px-12">
                <div className="block rounded-lg bg-[hsla(0,0%,100%,0.8)] px-6 py-12 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] md:py-16 md:px-12 -mt-[100px] backdrop-blur-[30px] border border-gray-300 max-w-6xl mx-auto">
                    <div className="flex flex-wrap">
                        {/* İletişim Formu */}
                        <div className="mb-12 w-full shrink-0 grow-0 basis-auto md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
  <form onSubmit={handleSubmit}>
    {/* Name Input */}
    <div className="relative mb-6">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100"
        id="name"
        placeholder="Name" // Placeholder eklendi
        required
      />
    </div>

    {/* Email Input */}
    <div className="relative mb-6">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100"
        id="email"
        placeholder="Email address" // Placeholder eklendi
        required
      />
    </div>

    {/* Message Textarea */}
    <div className="relative mb-6">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="block min-h-[auto] w-full rounded border-2 bg-transparent py-[0.32rem] px-3 leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100"
        id="message"
        rows="3"
        placeholder="Message" // Placeholder eklendi
        required
      ></textarea>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full rounded bg-red-500 text-white px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal"
    >
      Send
    </button>
  </form>
</div>

                        {/* İletişim Bilgileri */}
                        <div className="w-full shrink-0 grow-0 basis-auto lg:w-7/12">
                            <div className=" flex-col lg:flex-row lg:flex-wrap">
                                {/* Adres */}
                                <div className="mb-12 w-full lg:w-auto lg:px-6">
                                    <div className="flex items-start">
                                        <div className="shrink-0">
                                            <div className="inline-block rounded-md bg-red-100 p-4 text-red-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-6 grow">
                                            <p className="mb-2 font-bold">Address</p>
                                            <p className="text-neutral-500">
                                                Karlıbayır Cd. No:28, 34281 Arnavutköy/İstanbul
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="mb-12 w-full lg:w-auto lg:px-6">
                                    <div className="flex items-start">
                                        <div className="shrink-0">
                                            <div className="inline-block rounded-md bg-red-100 p-4 text-red-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-6 grow">
                                            <p className="mb-2 font-bold">Email</p>
                                            <p className="text-neutral-500">info@papercups.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Telefon */}
                                <div className="mb-12 w-full lg:w-auto lg:px-6">
                                    <div className="flex items-start">
                                        <div className="shrink-0">
                                            <div className="inline-block rounded-md bg-red-100 p-4 text-red-500">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-6 grow">
                                            <p className="mb-2 font-bold">Phone</p>
                                            <p className="text-neutral-500">+90 532 292 40 67</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;