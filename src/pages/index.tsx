import type { NextPage } from "next";
import Head from "next/head";
import { create } from 'ipfs-http-client';
import { useState, useRef } from "react";
import { XCircleIcon, PlusIcon } from "@heroicons/react/outline"
import type { FormEvent } from "react"
import toast from "react-hot-toast"

const Home: NextPage = () => {

  const [images, setImages] = useState(Array<string>)
  const [imagesToIpfs, setImagesToIpfs] = useState(Array<string>)
  const [gateway, setGateway] = useState("")
  const [imagesUrl, setImagesUrl] = useState(Array<string>)
  const publicGateway = "https://gateway.ipfs.io/ipfs"
  const imagePickerRef = useRef(null)

  const projectId = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_ID
  const projectSecret = process.env.NEXT_PUBLIC_INFURA_IPFS_PROJECT_SECRET
  const projectIdAndSecret = `${projectId}:${projectSecret}`

  const ipfsClient = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
        'base64'
      )}`,
    },
  })

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
    setImagesToIpfs(imagesToIpfs.filter((_, i) => i !== index))
  }

  const addImage = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setImages((prev: string[]) => [...prev, readerEvent?.target?.result as string]);
    };
    setImagesToIpfs((prev: string[]) => [...prev, e.target.files[0]])
  }

  const addImagesToIPFS = async () => {
    toast.loading("Uploading to IPFS...", { id: "uploading" })
    const selectedGateway = gateway.length > 0 ? gateway : publicGateway
    imagesToIpfs.forEach(async (image) => {
      const added = await ipfsClient.add(image)
      console.log(added)
      setImagesUrl((prev: string[]) => [...prev, `${selectedGateway}/${added.path}`])
      console.log(imagesUrl)
    });
    toast.success("Upload complete!", { id: "uploading" })
  }

  return (
    <>
      <Head>
        <title>IPFS Image Uploader</title>
        <meta name="description" content="Upload images with IPFS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <p className="flex justify-center mt-12 font-poppins text-white font-bold text-3xl">IPFS Image Uploader</p>
        <main className="min-h-screen items-center justify-center flex bg-base-100">
          <div className="flex flex-col space-y-10 w-1/4 mx-auto">
            <div className="flex flex-1 flex-col space-y-10 bg-base-200 p-8 rounded-lg shadow-xl">
              <form className="flex space-x-4" onSubmit={(event: FormEvent<HTMLFormElement>) => {
                event.preventDefault()
                if (event.currentTarget.gateway.value) {
                  setGateway("https://" + event.currentTarget.gateway.value + "/ipfs")
                } else {
                  setGateway(publicGateway)
                }
              }}>
                <input
                  type="text"
                  id="gateway"
                  className="bg-white flex-1 rounded-md p-2 outline-none text-black font-poppins placeholder:font-poppins text-sm placeholder:text-sm"
                  placeholder="Enter custom gateway..." />
                <button type="submit" className="btn btn-primary">Set</button>
              </form>
              <p className="font-poppins text-semibold">Current gateway: {`${gateway.length > 0 ? gateway : publicGateway}`}</p>
              <div className="flex space-x-4 items-center">
                {images.length > 0 &&
                  <div className="flex space-x-6 p-2 flex-wrap items-center">
                    {images.map((image, index) => {
                      return (
                        <div className="relative" key={index}>
                          <XCircleIcon className='absolute top-0 left-8 w-6 h-6 text-red-500 cursor-pointer' onClick={() => removeImage(index)} />
                          <img className='w-12 h-12 object-contain' src={image} alt="banner" />
                        </div>
                      )
                    })}
                  </div>
                }
                <button className='btn w-fit mx-auto' onClick={() => (imagePickerRef as any).current?.click()}>
                  <PlusIcon className='w-8 h-8 text-gray-400' />
                  <input ref={imagePickerRef} onChange={addImage} type="file" hidden />
                </button>
              </div>
              <button className="btn btn-secondary" disabled={images.length == 0} onClick={addImagesToIPFS}>Upload</button>
              {imagesUrl.length > 0 &&
                <div className="flex flex-col space-y-1">
                  {imagesUrl.map((url, index) => {
                    return (
                      <a
                        key={index}
                        className="hover:underline hover:text-info cursor-pointer"
                        href={url} target="_blank" rel="noreferrer noopener">#{index + 1} image link</a>
                    )
                  })}
                </div>}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

