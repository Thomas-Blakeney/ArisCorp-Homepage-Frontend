import { useEffect, useState } from 'react'
import { SquareLoader } from 'react-spinners'
import SelectionGridWrapper from './SelectionGridWrapper'
import { motion, AnimatePresence } from 'framer-motion'
import { GET_GAMEPLAYS, GET_FLEET } from 'graphql/queries'
import { useQuery } from '@apollo/client'
import HangarShipDetailCard from './internal/HangarShipCard'
import { BasicPanelButton } from './panels'
import Dropdown from './Dropdown'
import { useRouter } from 'next/router'
import { Tab } from '@headlessui/react'
import Image from 'next/image'

export default function OurFleet() {
  const { replace, query } = useRouter()
  const { data: rawGameplayData } = useQuery(GET_GAMEPLAYS)
  const { data: rawData, loading, error } = useQuery(GET_FLEET)
  const [detailView, setDetailView] = useState()
  const [selectedDepartment, setSelectedDepartment] = useState()
  const [departments, setDepartments] = useState([])
  const [apiData, setApiData] = useState([])
  const [data, setData] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const fleetquery = query.fleet

  useEffect(() => {
    if (fleetquery != null && fleetquery != '') {
      setSelectedIndex(fleetquery)
    } else {
      setSelectedIndex(0)
    }
  }, [fleetquery])

  useEffect(() => {
    if (rawData) {
      const ships = []
      rawData.member_ships.forEach((obj) => {
        const item = {
          id: obj.id,
          ship: obj.ships_id,
          member: obj.member_id,
          custom_data: {
            name: obj.name,
            serial: obj.serial,
            group: obj.group,
            visibility: obj.visibility,
            department: obj.department,
          },
        }
        ships.push(item)
      })
      setData(ships)
    }
  }, [rawData])

  useEffect(() => {
    if (rawGameplayData) {
      setDepartments(rawGameplayData.gameplays)
    }
  }, [rawGameplayData])

  useEffect(() => {
    // INITIAL STATES

    // LOCAL STORAGE
    const viewValue = window.localStorage.getItem('homeFleetDetailView')
    if (viewValue != null && viewValue != 'undefined') {
      setDetailView(JSON.parse(viewValue))
    }
  }, [])

  useEffect(() => {
    // STATE UPDATES

    // LOCAL STORAGE
    window.localStorage.setItem(
      'homeFleetDetailView',
      JSON.stringify(detailView)
    )
  }, [detailView])

  if (error) return <p>Error :(</p>

  if (loading) {
    return (
      <div id="fleet" className="flex justify-center pt-10">
        <SquareLoader color="#00ffe8" speedMultiplier="0.8" loading={loading} />
      </div>
    )
  }

  return (
    <>
      <h1 className="text-center text-primary">Flotte der ArisCorp</h1>
      <p className="text-center">
        Die Flotte der ArisCorp stellt sich aus den Schiffen zusammen, die von
        Mitarbeiter der ArisCorp zur verfügung gestellt werden.
      </p>
      <div>
        <Tab.Group
          selectedIndex={selectedIndex}
          onChange={(event) =>
            (query.about != null && query.about != ''
              ? replace(
                  {
                    query: {
                      about: query.about,
                      our: query.our,
                      fleet: event,
                    },
                  },
                  undefined,
                  { shallow: true }
                )
              : replace({ query: { our: event } }, undefined, {
                  shallow: true,
                })) + setSelectedIndex(event)
          }
        >
          <Tab.List className={'w-full mx-auto'}>
            <div className="flex justify-center mx-auto">
              <Tab
                key={'alle'}
                className={
                  'p-3 m-1 basis-full flex justify-center focus-visible:outline-none'
                }
              >
                {/* <div
                className={
                  'relative mx-3 my-2 transition-all duration-300 ease-out border-solid cursor-pointer h-24 w-24 border-1 hover:scale-150 ' +
                  (selectedIndex == 0 ? 'scale-125' : '')
                }
              > */}
                <div
                  className={
                    'relative mx-3 my-2 transition-all duration-300 ease-out border-solid cursor-pointer h-24 w-24 border-1 hover:scale-150 ' +
                    (selectedIndex == 0 ? 'scale-125' : '')
                  }
                >
                  <Image
                    src={
                      'https://cms.ariscorp.de/assets/a3495a27-dc35-4ba9-a37b-a5752db473ee'
                    }
                    fill
                    cover
                    placeholder="blur"
                    blurDataURL={
                      'https://cms.ariscorp.de/assets/a3495a27-dc35-4ba9-a37b-a5752db473ee' +
                      '?width=16&quality=1'
                    }
                    alt={'Alle Logo'}
                  />
                </div>
              </Tab>
            </div>
            <div className="flex flex-wrap justify-center xl:grid xl:grid-flow-col xl:grid-rows-1">
              {departments.map((data, index) => (
                <Tab
                  key={data.id}
                  className={'p-3 m-1 focus-visible:outline-none'}
                >
                  <div
                    className={
                      'relative mx-1 my-2 transition-all duration-300 ease-out border-solid cursor-pointer h-fit w-fit border-1 hover:scale-150 ' +
                      (selectedIndex == index + 1 ? 'scale-125' : '')
                    }
                  >
                    <Image
                      src={
                        'https://cms.ariscorp.de/assets/' +
                        data.gameplay_logo.id +
                        '?format=webp'
                      }
                      width={80}
                      height={80}
                      cover
                      placeholder="blur"
                      blurDataURL={
                        'https://cms.ariscorp.de/assets/' +
                        data.gameplay_logo.id +
                        '?format=webp&width=16&quality=1'
                      }
                      alt={data.gameplay_name + ' Logo'}
                    />
                  </div>
                </Tab>
              ))}
            </div>
            <hr />
          </Tab.List>
          <Tab.Panels className={'p-4'}>
            <Tab.Panel key={'alle'}>
              <div className="mx-auto text-center cursor-pointer max-w-7xl">
                <div className="max-w-[1100px] mx-auto">
                  <h1 className="pb-4 uppercase text-primary">Alle</h1>
                  {/* <div className="max-w-5xl mx-auto mt-4 text-center"> */}
                  <div className="grid grid-cols-1 px-2 text-left lg:grid-cols-2 gap-x-6 gap-y-4">
                    <AnimatePresence>
                      {data.map((object) => (
                        <motion.div
                          key={object.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          exit={{ opacity: 0 }}
                        >
                          <HangarShipDetailCard
                            fleetView
                            detailView={detailView}
                            data={object}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                  {/* </div> */}
                </div>
                <hr />
              </div>
            </Tab.Panel>
            {departments.map((dep) => (
              <Tab.Panel key={dep.id}>
                <div className="mx-auto text-center cursor-pointer max-w-7xl">
                  <div className="max-w-[1100px] mx-auto">
                    <h1 className="pb-4 uppercase text-primary">
                      {dep.gameplay_name}
                    </h1>
                    {/* <div className="max-w-5xl mx-auto mt-4 text-center"> */}
                    <div className="grid grid-cols-1 px-2 text-left lg:grid-cols-2 gap-x-6 gap-y-4">
                      <AnimatePresence>
                        {data
                          .filter(
                            (e) =>
                              e.custom_data.department?.gameplay_name ==
                              dep.gameplay_name
                          )
                          .map((object) => (
                            <motion.div
                              key={object.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                              exit={{ opacity: 0 }}
                            >
                              <HangarShipDetailCard
                                fleetView
                                detailView={detailView}
                                data={object}
                              />
                            </motion.div>
                          ))}
                      </AnimatePresence>
                    </div>
                    {/* </div> */}
                  </div>
                  <hr />
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </>
  )
}
