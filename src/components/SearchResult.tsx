import "./SearchResult.css";
import { SearchBar } from "./SearchBar"; 

interface SearchResultProps {
  result: string;
  longitude: string;
  latitude: string;
}

export const SearchResult: React.FC<SearchResultProps> = ({ result, latitude, longitude  }) => {
  return (
    <div
      className="search-result"
      onClick={(e: React.MouseEvent<HTMLDivElement>) =>
        alert(`You selected ${result}! \n(${latitude}, ${longitude})`)
      }
    >
        {result}
    </div>
  );
};
