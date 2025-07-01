import Navbar from '@/Components/App/Navbar';
import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout(
  {
    children
  }: PropsWithChildren<{ header?: ReactNode }>) {

  const props = usePage().props;
  const [successMessages, setSuccessMessages] = useState<any[]>([]);
  const timeoutRef = useRef<{ [key: number]: NodeJS.Timeout }>({});

  useEffect(() => {
    if (props.success.message) {
      const newMessage = {
        ...props.success,
        id: props.success.time
      };

      setSuccessMessages((prevMessages) => [newMessage, ...prevMessages]);

      timeoutRef.current[newMessage.id] = setTimeout(() => {

        setSuccessMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== newMessage.id)
        );

        delete timeoutRef.current[newMessage.id];
      }, 5000);
    }
  }, [props.success]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {props.errors && (
        <div className="container mx-auto px-8 mt-8">
          {Object.keys(props.errors).map((key) => (
            <div
              key={key}
              className="alert alert-error">
              {props.errors[key]}
            </div>
          ))}
        </div>
      )}
      {successMessages.length > 0 && (
        <div className="toast toast-top toast-end z-[1000] mt-16">
          {successMessages.map((message) => (
            <div
              key={message.id}
              className="alert alert-success">
              {message.message}
            </div>
          ))}
        </div>
      )}
      <main>{children}</main>
    </div>
  );
}
