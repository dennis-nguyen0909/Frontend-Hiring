import { useState, useEffect } from 'react';
import { Level_API } from '../services/modules/LevelServices';
import { useSelector } from 'react-redux';
import { Meta } from '../types';
import { JOB_CONTRACT_TYPE_API } from '../services/modules/JobContractTypeService';
import { CURRENCY_API } from '../services/modules/CurrenciesServices';

type CurrencyType = {
  _id: string;
  name: string;
  key: string;
  symbol:string;
  code:string;
};

export const useCurrency = (page: number = 1, pageSize: number = 10) => {
  const [data, setData] = useState<CurrencyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [meta, setMeta] = useState<Meta>({}); // tổng số kết quả
  const user = useSelector((state: any) => state.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await CURRENCY_API.getAll({ page, pageSize },user?.access_token);
        setData(response.data.items);
        setMeta(response.data.meta)
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize]); // khi page hoặc pageSize thay đổi thì gọi lại API

  return { data, loading, error, meta };
};
