"use client"
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { postEvent, retrieveRawInitData, User } from '@telegram-apps/sdk';
import { useEffect, useState } from "react";

export default function Home() {
  const initData = retrieveRawInitData();
  const [user, setUser] = useState<User | null>(null)
  async function validate() {
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        body: JSON.stringify({ initData }),
      })

      const data = await res.json()
      if (data.success) {
        setUser(data.data)
      } else {
        enqueueSnackbar(data.message, {
          variant: 'error',
        })
      }
    } catch (error) {
      enqueueSnackbar('Something went wrong', {
        variant: 'error',
      })
      console.log(error, '?')
    }
  }
  useEffect(() => {
    postEvent('web_app_request_fullscreen',);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <SnackbarProvider />
      <h1 className="text-xl font-bold mb-2">@Hikariii03</h1>
      <h1>Hello World</h1>
      <div className="mt-12">
        <button onClick={validate} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Validate User
        </button>
        <div className="mt-4 h-12">
          {user && <h1> Hi! &nbsp;
            <span className="text-blue-500 underline">{user.username}</span></h1>
          }
        </div>
      </div>
    </div >
  );
}
