import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

export const generatePaginationLinks = (
  currentPage: number,
  totalPages: number,
  onPageChange: (page: number) => void
) => {
  const pages: JSX.Element[] = [];

  // Kasus ketika jumlah halaman total kurang dari atau sama dengan 6
  if (totalPages <= 4) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => onPageChange(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
  } else {
    // Kasus untuk halaman pertama, kedua, dan ellipsis
    if (currentPage === 1) {
      for (let i = 1; i <= 2; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      pages.push(<PaginationEllipsis />);
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    } else if (currentPage === totalPages) {
      // Kasus untuk halaman terakhir
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange(1)}
            isActive={1 === currentPage}
          >
            {1}
          </PaginationLink>
        </PaginationItem>
      );
      pages.push(<PaginationEllipsis />);
      for (let i = totalPages - 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => onPageChange(i)}
              isActive={i === currentPage}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else if (currentPage === 2) {
      // Kasus untuk halaman kedua
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange(1)}
            isActive={1 === (currentPage as number)}
          >
            {1}
          </PaginationLink>
        </PaginationItem>
      );
      pages.push(
        <PaginationItem key={2}>
          <PaginationLink
            onClick={() => onPageChange(2)}
            isActive={2 === currentPage}
          >
            {2}
          </PaginationLink>
        </PaginationItem>
      );
      pages.push(<PaginationEllipsis />);
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    } else if (currentPage === totalPages - 1) {
      // Kasus untuk halaman kedua terakhir
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange(1)}
            isActive={1 === currentPage}
          >
            {1}
          </PaginationLink>
        </PaginationItem>
      );
      pages.push(<PaginationEllipsis />);
      pages.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink
            onClick={() => onPageChange(totalPages - 1)}
            isActive={totalPages - 1 === currentPage}
          >
            {totalPages - 1}
          </PaginationLink>
        </PaginationItem>
      );
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    } else {
      // Kasus untuk halaman yang ada di tengah-tengah
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => onPageChange(1)}
            isActive={1 === currentPage}
          >
            {1}
          </PaginationLink>
        </PaginationItem>
      );
      pages.push(<PaginationEllipsis />);
      pages.push(
        <PaginationItem key={currentPage}>
          <PaginationLink
            onClick={() => onPageChange(currentPage)}
            isActive={currentPage === currentPage}
          >
            {currentPage}
          </PaginationLink>
        </PaginationItem>
      );
      pages.push(<PaginationEllipsis />);
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => onPageChange(totalPages)}
            isActive={totalPages === currentPage}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
  }

  return pages;
};

// export const generatePaginationLinks = (
//   currentPage: number,
//   totalPages: number,
//   onPageChange: (page: number) => void
// ) => {
//   const pages: JSX.Element[] = [];
//   if (totalPages <= 6) {
//     for (let i = 1; i <= totalPages; i++) {
//       pages.push(
//         <PaginationItem key={i}>
//           <PaginationLink
//             onClick={() => onPageChange(i)}
//             isActive={i === currentPage}
//           >
//             {i}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     }
//   } else {
//     for (let i = 1; i <= 2; i++) {
//       pages.push(
//         <PaginationItem key={i}>
//           <PaginationLink
//             onClick={() => onPageChange(i)}
//             isActive={i === currentPage}
//           >
//             {i}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     }
//     if (2 < currentPage && currentPage < totalPages - 1) {
//       pages.push(<PaginationEllipsis />);
//       pages.push(
//         <PaginationItem key={currentPage}>
//           <PaginationLink
//             onClick={() => onPageChange(currentPage)}
//             isActive={true}
//           >
//             {currentPage}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     }
//     pages.push(<PaginationEllipsis />);
//     for (let i = totalPages - 1; i <= totalPages; i++) {
//       pages.push(
//         <PaginationItem key={i}>
//           <PaginationLink
//             onClick={() => onPageChange(i)}
//             isActive={i === currentPage}
//           >
//             {i}
//           </PaginationLink>
//         </PaginationItem>
//       );
//     }
//   }
//   return pages;
// };
