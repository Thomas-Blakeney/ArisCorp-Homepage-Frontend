import Layout from 'pages/VerseExkurs/layout'
import Image from 'next/legacy/image'
import client from 'apollo/clients'
import { GET_VERSEEXKURS_SPECTRUM_ARTICLES } from 'graphql/queries'
import ArticleCard from 'components/VerseExkursArticleCard'
import Head from 'next/head'

export async function getServerSideProps () {
  const { data } = await client.query({
    query: GET_VERSEEXKURS_SPECTRUM_ARTICLES,
  })

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      data: await data.spectrum,
    },
  }
}

export default function SpectrumPage ({ data }) {
  const Data = data.data

  return (
    <div className="pt-3 print:pt-0">
      <Head>
        <title>
          Astro Research and Industrial Service Corporation - VerseExurs: Spectrum
        </title>
      </Head>
      <div className="flex flex-wrap w-full aspect-[40/21] scale-90">
        <div className="relative w-full">
          <Image
            src="https://cms.ariscorp.de/assets/6e633dd2-1512-405d-92e0-fb3907de86a1"
            layout="fill"
            alt="Spectrum Banner"
            placeholder="blur"
            blurDataURL="https://cms.ariscorp.de/assets/6e633dd2-1512-405d-92e0-fb3907de86a1"
            objectFit="cover"
          />
        </div>
      </div>
      <div className="-mt-5 scale-95">
        <hr />
      </div>
      <div>
        {data
          .filter((data) => data.spectrum_kategorie_beschreibung == true)
          .map((data) => (
            <ArticleCard
              key={data.id}
              link={data.id == 19 ? 'spectrum/19/125' : 'spectrum/' + data.id}
              title={data.spectrum_titel}
              desc={data.text}
              image={data.image?.id}
              seperator={true}
            />
          ))}
      </div>
    </div>
  )
}

SpectrumPage.getLayout = function getLayout (page) {
  return <Layout>{page}</Layout>
}
