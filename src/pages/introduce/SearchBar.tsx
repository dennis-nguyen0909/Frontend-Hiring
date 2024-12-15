import React, { useState, useEffect, useCallback } from 'react';
import { JobApi } from '../../services/modules/jobServices';
import { useSelector } from 'react-redux';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = () => {
  const [query, setQuery] = useState(''); // giá trị từ ô search
  const [results, setResults] = useState([]); // lưu kết quả tìm kiếm
  const [page, setPage] = useState(1); // trang hiện tại
  const [hasMore, setHasMore] = useState(true); // kiểm tra còn dữ liệu không
  const [loading, setLoading] = useState(false); // trạng thái loading
  const userDetail = useSelector(state => state.user);

  // Sử dụng useDebounce để debounce giá trị query
  const debouncedQuery = useDebounce(query, 500); // Debounce sau 500ms

  // Hàm fetch dữ liệu, chỉ chạy khi cần thiết
  const fetchSearchResults = useCallback(async (pageNumber = 1) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = {
        search: {
          keyword: debouncedQuery // Sử dụng giá trị query đã debounce
        }
      };

      const response = await JobApi.getAllJobsQuery(params, userDetail?.id);

      // Kiểm tra xem có dữ liệu mới không
      if (response.data.items.length > 0) {
        setResults((prevResults) => [...prevResults, ...response.data.items]);
      } else {
        setHasMore(false); // Nếu không còn dữ liệu thì set lại hasMore
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu', error);
    }
    setLoading(false);
  }, [debouncedQuery, hasMore, loading, userDetail]);

  // Gọi API khi debouncedQuery thay đổi
  useEffect(() => {
    if (debouncedQuery.length > 0) {
      setPage(1); // Reset trang
      setHasMore(true); // Reset hasMore
      setResults([]); // Reset kết quả
      fetchSearchResults(1); // Gọi API lần đầu khi query thay đổi
    }
  }, [debouncedQuery, fetchSearchResults]);

  // Gọi API khi page thay đổi
  useEffect(() => {
    if (page > 1 && debouncedQuery.length > 0) {
      fetchSearchResults(page); // Gọi API khi page thay đổi
    }
  }, [page, fetchSearchResults, debouncedQuery]);

  // Hàm xử lý khi scroll tới cuối danh sách
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1); // Chỉ tăng page nếu đã scroll đến cuối
    }
  };

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Tìm kiếm..."
      />

      <div onScroll={handleScroll} style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {results.map((item, index) => (
          <div key={index} className="search-item">
            {item.name}
          </div>
        ))}
        {loading && <p>Đang tải thêm...</p>}
        {!hasMore && <p>Không còn kết quả nào nữa.</p>}
      </div>
    </div>
  );
};

export default SearchBar;
