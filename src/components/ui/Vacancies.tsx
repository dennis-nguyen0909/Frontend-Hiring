interface IVacanciesProps {
  name: string;
  amount: string;
  position: string;
  idx: number;
}
const Vacancies = ({ name, amount, position, idx }: IVacanciesProps) => {
  return (
    <div key={idx} className="w-[312px] h-auto py-3">
      <h1 className="text-[20px] text-textBlack font-semibold">{name}</h1>
      <p className="text-grayText">
        {amount} <span>{position}</span>
      </p>
    </div>
  );
};

export default Vacancies;
