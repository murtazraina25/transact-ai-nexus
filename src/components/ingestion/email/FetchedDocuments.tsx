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
import { Eye, Trash2 } from "lucide-react";

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
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.NO</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>File Path</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Date Received</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Doc Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((doc, index) => (
                <TableRow key={doc.file_path}>
                  <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                  <TableCell>{doc.file_name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {doc.file_path}
                  </TableCell>
                  <TableCell>{doc.sender_id_name}</TableCell>
                  <TableCell>{doc.received_date_time}</TableCell>
                  <TableCell>{doc.subject || "—"}</TableCell>
                  <TableCell>{doc.doc_type || "—"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleView(doc.email_uid)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(doc.email_uid)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground"
                >
                  No documents found for this account.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
