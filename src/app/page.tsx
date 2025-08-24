"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TextInput from "@/components/TextInput";
import Button from "@/components/Button";
import Pill from "@/components/Pill";
import { TableRow, TableCell, TableHeaderCell } from "@/components/Table";

type Advocate = {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

type ApiResponse = {
  data: Advocate[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  query: string;
};

const DEFAULT_PAGE_SIZE = 10;

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [data, setData] = useState<Advocate[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSearchChange = useCallback((value: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setPage(1);
      setQuery(value);
    }, 300);
  }, []);

  const fetchKey = useMemo(
    () => `/api/advocates?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`,
    [query, page, pageSize]
  );

  useEffect(() => {
    const controller = new AbortController();
    const requestId = requestIdRef.current;
    setIsLoading(true);
    setError(null);

    fetch(fetchKey, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json: ApiResponse = await res.json();
        if (requestId === requestIdRef.current) {
          setData(json.data);
          setTotal(json.total);
          setTotalPages(json.totalPages);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message || "Unknown error");
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [fetchKey]);

  const resetSearch = useCallback(() => {
    setSearchText("");
    setQuery("");
    setPage(1);
  }, []);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-semibold">Solace Advocates</h1>

      <div className="mt-6 flex flex-col gap-2">
        <TextInput
          id="search"
          label="Search advocates"
          placeholder="Name, city, degree, specialty..."
          value={searchText}
          onChange={(e) => {
            const value = e.target.value;
            setSearchText(value);
            onSearchChange(value);
          }}
        />
        <div className="flex gap-2">
          <Button onClick={resetSearch}>Reset</Button>
        </div>
        <p className="text-sm text-gray-500">Searching for: {query || "(all)"}</p>
      </div>

      <div className="mt-6 rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <TableRow>
                <TableHeaderCell>First Name</TableHeaderCell>
                <TableHeaderCell>Last Name</TableHeaderCell>
                <TableHeaderCell>City</TableHeaderCell>
                <TableHeaderCell>Degree</TableHeaderCell>
                <TableHeaderCell>Specialties</TableHeaderCell>
                <TableHeaderCell>Years</TableHeaderCell>
                <TableHeaderCell>Phone</TableHeaderCell>
              </TableRow>
            </thead>
            <tbody>
              {isLoading ? (
                <TableRow>
                  <TableCell className="px-4 py-6" colSpan={7}>Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell className="px-4 py-6 text-red-600" colSpan={7}>{error}</TableCell>
                </TableRow>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell className="px-4 py-6" colSpan={7}>No results</TableCell>
                </TableRow>
              ) : (
                data.map((advocate) => (
                  <TableRow key={advocate.id} className="border-t">
                    <TableCell>{advocate.firstName}</TableCell>
                    <TableCell>{advocate.lastName}</TableCell>
                    <TableCell>{advocate.city}</TableCell>
                    <TableCell>{advocate.degree}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {advocate.specialties.map((s, idx) => (
                          <Pill key={`${advocate.id}-sp-${idx}`}>{s}</Pill>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{advocate.yearsOfExperience}</TableCell>
                    <TableCell>{advocate.phoneNumber}</TableCell>
                  </TableRow>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm text-gray-600">
            Page {page} of {totalPages} • {total} total
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={!canPrev}>
              Previous
            </Button>
            <Button size="sm" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={!canNext}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
