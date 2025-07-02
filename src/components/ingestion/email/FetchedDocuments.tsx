// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import { EmailAccount } from "@/types/models/email";

// interface DocumentItem {
//   id: string
//   email: string
//   type: string
//   subject: string
//   date: string
// }

// const getEmailByIndex = (i: number) => {
//   if (i % 3 === 0) return "billdeskyavartst@gmail.com"
//   if (i % 3 === 1) return "murtazraina7@gmail.com"
//   return "murtaz.r@archeglobal.onmicrosoft.com"
// }

// const mockDocuments: DocumentItem[] = Array.from({ length: 45 }, (_, i) => ({
//   id: (i + 1).toString(),
//   email: getEmailByIndex(i),
//   type: ["Invoice", "Purchase Order", "Challan"][i % 3],
//   subject: `Document #${i + 1}`,
//   date: `2024-06-${String((i % 30) + 1).padStart(2, "0")}`,
// }))

// interface FetchedDocumentsTableProps {
//   account: EmailAccount | null;
// }

// export function FetchedDocumentsTable({ account }: FetchedDocumentsTableProps) {
//   const [filteredData, setFilteredData] = useState<typeof mockDocuments>([]);
//   const [totalItems, setTotalItems] = useState(0);
//   const [page, setPage] = useState(1);
//   const pageSize = 10;

//   // Reset page when account changes
//   useEffect(() => {
//     if (account?.email) {
//       setPage(1);
//     } else {
//       setFilteredData([]);
//       setTotalItems(0);
//       setPage(1);
//     }
//   }, [account]);

//   // Fetch paginated data (mocked)
//   useEffect(() => {
//     if (!account?.email) return;

//     // Simulate API filtering
//     const accountDocs = mockDocuments.filter((doc) => doc.email === account.email)

//     // Simulate pagination
//     const start = (page - 1) * pageSize;
//     const end = start + pageSize;
//     const paginated = accountDocs.slice(start, end);

//     setFilteredData(paginated);
//     setTotalItems(accountDocs.length);

//     // If using real API:
//     // const res = await fetch(`/api/documents?email=${account.email}&page=${page}&limit=${pageSize}`)
//     // const data = await res.json()
//     // setFilteredData(data.data)
//     // setTotalItems(data.total)
//   }, [account?.email, page, pageSize]);

//   const totalPages = Math.ceil(totalItems / pageSize);

//   const handleView = (id: string) => {
//     console.log("View doc:", id);
//   };

//   const handleDelete = (id: string) => {
//     console.log("Delete doc:", id);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[80px]">S.NO</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Subject</TableHead>
//               <TableHead>Date</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredData.length > 0 ? (
//               filteredData.map((doc, index) => (
//                 <TableRow key={doc.id}>
//                   <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
//                   <TableCell>{doc.type}</TableCell>
//                   <TableCell>{doc.subject}</TableCell>
//                   <TableCell>{doc.date}</TableCell>
//                   <TableCell className="text-right space-x-2">
//                     <Button
//                       variant="secondary"
//                       size="sm"
//                       onClick={() => handleView(doc.id)}
//                     >
//                       View
//                     </Button>
//                     <Button
//                       variant="destructive"
//                       size="sm"
//                       onClick={() => handleDelete(doc.id)}
//                     >
//                       Delete
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={5}
//                   className="text-center text-muted-foreground"
//                 >
//                   No documents found for this account.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination Controls */}
//       {totalPages > 1 && (
//         <div className="flex justify-end items-center gap-4">
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={() => setPage((p) => Math.max(p - 1, 1))}
//             disabled={page === 1}
//           >
//             Previous
//           </Button>
//           <span className="text-sm text-muted-foreground">
//             Page {page} of {totalPages}
//           </span>
//           <Button
//             size="sm"
//             variant="outline"
//             onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//             disabled={page === totalPages}
//           >
//             Next
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// }


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { EmailAccount } from "@/types/models/email";

interface FetchedDocumentsTableProps {
  account: EmailAccount | null;
}

export function FetchedDocumentsTable({ account }: FetchedDocumentsTableProps) {
  const [filteredData, setFilteredData] = useState(account?.records ?? []);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (!account?.records || account.records.length === 0) {
      setFilteredData([]);
      setTotalItems(0);
      setPage(1);
      return;
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = account.records.slice(start, end);

    setFilteredData(paginated);
    setTotalItems(account.records.length);
  }, [account?.records, page]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handleView = (email_uid: string) => {
    console.log("View doc:", email_uid);
  };

  const handleDelete = (email_uid: string) => {
    console.log("Delete doc:", email_uid);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">S.NO</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((doc, index) => (
                <TableRow key={doc.file_path}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{doc.doc_type || "—"}</TableCell>
                  <TableCell>{doc.subject || "—"}</TableCell>
                  <TableCell>{doc.received_date_time || "—"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleView(doc.email_uid)}
                    >
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(doc.email_uid)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No documents found for this account.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
