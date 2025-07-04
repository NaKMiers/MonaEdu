'use client'

import AdminHeader from '@/components/admin/AdminHeader'
import AdminMeta from '@/components/admin/AdminMeta'
import SummaryItem from '@/components/admin/SummaryItem'
import Pagination from '@/components/layouts/Pagination'
import { useAppDispatch } from '@/libs/hooks'
import { setPageLoading } from '@/libs/reducers/modalReducer'
import { IUser } from '@/models/UserModel'
import { getAllCollaboratorsApi, sendSummaryApi } from '@/requests/summaryRequest'
import { handleQuery } from '@/utils/handleQuery'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

function AllSummariesPage({ searchParams }: { searchParams?: { [key: string]: string[] } }) {
  // hooks
  const dispatch = useAppDispatch()

  // states
  const [summaries, setSummaries] = useState<IUser[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedSummaries, setSelectedSummaries] = useState<string[]>([])

  // loading
  const [loadingSummaries, setLoadingSummaries] = useState<string[]>([])

  // values
  const itemPerPage = 9

  // MARK: Get Data
  // get all summaries
  useEffect(() => {
    // get all summaries
    const getAllSummaries = async () => {
      const query = handleQuery(searchParams)

      // start page loading
      dispatch(setPageLoading(true))

      try {
        // send request to server to get all courses
        const { collaborators, amount } = await getAllCollaboratorsApi(query)

        // set courses to state
        setSummaries(collaborators)
        setAmount(amount)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        // stop page loading
        dispatch(setPageLoading(false))
      }
    }
    getAllSummaries()
  }, [dispatch, searchParams])

  // MARK: Handlers
  // sent summaries
  const handleSendSummaries = useCallback(async (ids: string[]) => {
    // set loading
    setLoadingSummaries(ids)

    try {
      // send request to server
      const { message } = await sendSummaryApi(ids)

      // show success message
      toast.success(message)
    } catch (err: any) {
      console.log(err)
      toast.error(err.message)
    } finally {
      // stop loading
      setLoadingSummaries([])
      setSelectedSummaries([])
    }
  }, [])

  // keyboard event
  useEffect(() => {
    // page title
    document.title = 'Summary - Mona Edu'

    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        setSelectedSummaries(prev =>
          prev.length === summaries.length ? [] : summaries.map(summary => summary._id)
        )
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [summaries])

  return (
    <div className="w-full">
      {/* MARK: Top & Pagination */}
      <AdminHeader title="All Summaries" />
      <Pagination
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={itemPerPage}
      />

      {/* MARK: Filter */}
      <AdminMeta
        handleFilter={() => {}}
        handleResetFilter={() => {}}
      >
        {/* MARK: Select Filter */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-3 md:col-span-8"></div>

        {/* MARK: Action Buttons */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-2">
          {/* Select All Button */}
          <button
            className="trans-200 rounded-lg border border-sky-400 px-3 py-2 text-sky-400 hover:bg-sky-400 hover:text-light"
            title="Alt + A"
            onClick={() =>
              setSelectedSummaries(
                selectedSummaries.length > 0 ? [] : summaries.map(summary => summary._id)
              )
            }
          >
            {selectedSummaries.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Send Summaries Button */}
          {!!selectedSummaries.length && (
            <button
              className="trans-200 rounded-lg border border-green-500 px-3 py-2 text-green-500 hover:bg-green-500 hover:text-light"
              title="Alt + Delete"
              onClick={() => handleSendSummaries(selectedSummaries)}
            >
              Sent
            </button>
          )}
        </div>
      </AdminMeta>

      {/* MARK: Amount */}
      <div className="p-3 text-right text-sm font-semibold text-light">
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount} collaborator
        {amount > 1 ? 's' : ''}
      </div>

      {/* MARK: MAIN LIST */}
      <div className="grid grid-cols-1 gap-21 md:grid-cols-2 lg:grid-cols-3">
        {summaries.map(user => (
          <SummaryItem
            data={user}
            loadingSummaries={loadingSummaries}
            // selected
            selectedSummaries={selectedSummaries}
            setSelectedSummaries={setSelectedSummaries}
            // functions
            handleSendSummaries={handleSendSummaries}
            key={user._id}
          />
        ))}
      </div>
    </div>
  )
}

export default AllSummariesPage
