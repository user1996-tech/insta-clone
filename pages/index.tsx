import Head from 'next/head'
import Header from './Header'
import Feed from './Feed'
import Modal from './Modal'

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal />

      {/* Header  */}
      <Header />

      {/* Feed */}
      <Feed />

      {/* Modal */}

      <h1>This is the INSTAGRAM 2.0 BUILD</h1>
    </div>
  )
}
