import { useRef, useState, Fragment } from 'react'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import { Dialog, Transition } from '@headlessui/react'
import { CameraIcon } from '@heroicons/react/outline'
import { db, storage } from '../firebase'
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import { ref, getDownloadURL, uploadString } from 'firebase/storage'

const Modal = () => {
  const { data: session } = useSession()
  const [open, setOpen] = useRecoilState(modalState)
  const [loading, setLoading] = useState(false)
  const filePickerRef = useRef(null)
  const captionRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const addImageToPost = (e) => {
    const reader = new FileReader()
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0])
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result)
    }
  }
  const uploadPost = async () => {
    if (loading) return

    setLoading(true)

    const docRef = await addDoc(collection(db, 'posts'), {
      username: session.user.username,
      caption: captionRef.current.value,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
    })

    console.log('New doc aded with ID', docRef.id)

    const imageRef = ref(storage, `posts/${docRef.id}/image`)

    await uploadString(imageRef, selectedFile, 'data_url').then(
      async (snapshot) => {
        const downloadUrl = await getDownloadURL(imageRef)
        await updateDoc(doc(db, 'posts', docRef.id), {
          image: downloadUrl,
        })
      }
    )

    setOpen(false)
    setLoading(false)
    setSelectedFile(null)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="item-end flex min-h-[800px] justify-center px-4 pt-4 pb-20 text-center sm:block sm:min-h-screen sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* Center modal contents */}
          <span
            className="sm:inling-block hidden sm:h-screen sm:align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6 sm:align-middle">
              <div>
                {selectedFile ? (
                  <img
                    src={selectedFile}
                    onClick={() => setSelectedFile(null)}
                    alt=""
                  />
                ) : (
                  <div
                    className="mx-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-100"
                    onClick={() => filePickerRef.current.click()}
                  >
                    <CameraIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-600"
                  >
                    Upload a photo
                  </Dialog.Title>
                </div>

                <div>
                  <input
                    type="text"
                    ref={filePickerRef}
                    onChange={addImageToPost}
                    type="file"
                    hidden
                  />
                </div>

                <div className="mt-2">
                  <input
                    type="text"
                    className="w-full border-none text-center focus:ring-0"
                    ref={captionRef}
                    placeholder="Please enter a caption.."
                  />
                </div>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  disabled={!selectedFile}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 hover:disabled:bg-gray-300 sm:text-sm"
                  onClick={uploadPost}
                >
                  {loading ? 'Uploading...' : 'Upload Post'}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
