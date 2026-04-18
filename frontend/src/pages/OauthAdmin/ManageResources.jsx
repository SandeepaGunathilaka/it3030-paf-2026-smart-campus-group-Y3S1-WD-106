import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import ResourceForm from './ResourceForm'
import ResourceTable from './ResourceTable'
import { createResource, deleteResource, getAllResources, updateResource } from '../../api/resourceService'

const TYPE_OPTIONS = ['ALL', 'LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']
const STATUS_OPTIONS = ['ALL', 'ACTIVE', 'OUT_OF_SERVICE']
const PAGE_SIZE = 8

export default function ManageResources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [showForm, setShowForm] = useState(false)
  const [formMode, setFormMode] = useState('add')
  const [selectedResource, setSelectedResource] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [page, setPage] = useState(1)

  const loadResources = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAllResources()
      setResources(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load resources. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [searchTerm, filterType, filterStatus])

  const filteredResources = useMemo(() => {
    return resources
      .filter((resource) => {
        const matchesName = resource.name?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesType = filterType === 'ALL' || resource.type === filterType
        const matchesStatus = filterStatus === 'ALL' || resource.status === filterStatus
        return matchesName && matchesType && matchesStatus
      })
      .sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0))
  }, [resources, searchTerm, filterType, filterStatus])

  const pageCount = Math.max(1, Math.ceil(filteredResources.length / PAGE_SIZE))
  const paginatedResources = filteredResources.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleOpenAdd = () => {
    setSelectedResource(null)
    setFormMode('add')
    setShowForm(true)
  }

  const handleEdit = (resource) => {
    setSelectedResource(resource)
    setFormMode('update')
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return

    setActionLoading(true)
    try {
      await deleteResource(id)
      setResources((current) => current.filter((item) => item.id !== id))
      toast.success('Deleted Successfully')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete resource')
    } finally {
      setActionLoading(false)
    }
  }

  const handleFormSubmit = async (payload) => {
    setActionLoading(true)
    try {
      if (formMode === 'add') {
        await createResource(payload)
        toast.success('Added Successfully')
      } else {
        await updateResource(selectedResource.id, payload)
        toast.success('Updated Successfully')
      }
      setShowForm(false)
      setSelectedResource(null)
      loadResources()
    } catch (err) {
      toast.error(err?.response?.data?.message || `Failed to ${formMode === 'add' ? 'add' : 'update'} resource`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedResource(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Resources</h1>
            <p className="mt-1 text-sm text-gray-500">Manage campus facilities, rooms and equipment.</p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Add Resource
          </button>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_220px]">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Search</span>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by resource name"
                className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Filter Type</span>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Filter Status</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <div className="hidden lg:block" />
          </div>

          {error && (
            <div className="mt-5 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
          )}

          <div className="mt-6">
            <ResourceTable
              resources={paginatedResources}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {!loading && filteredResources.length > PAGE_SIZE && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
              <p>{filteredResources.length} resources found</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-2">Page {page} of {pageCount}</span>
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                  disabled={page === pageCount}
                  className="rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <ResourceForm
          mode={formMode}
          resource={selectedResource}
          loading={actionLoading}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
