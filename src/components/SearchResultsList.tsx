import "./SearchResultsList.css";
import { SearchResult } from "./SearchResult";

interface SearchResultsListProps {
  results: { name: string, country: string, admin1: string, latitude: string, longitude: string}[];
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  return (
    <div className="results-list">
      {results.map((result, id) => {
        return <SearchResult result={result.name + ", " + result.admin1 + ", " + result.country} key={id} latitude ={result.latitude} longitude ={result.longitude} />;
      })}
    </div>
  );
};
