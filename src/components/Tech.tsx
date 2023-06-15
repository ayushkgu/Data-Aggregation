import React, { useState, useEffect } from 'react';
import axios from 'axios';
import newsAPIKey from '../newsAPIKey';
import './Tech.css'
import { printQuery, getArticles } from '../newsfirestore';

interface Article {
  id: number;
  title: string;
  url: string;
  urlToImage: string;
}

const Tech: React.FC = () => {
  const [posts, setPosts] = useState<Article[]>([]);

  const handleQuery = async() => 
  {
    console.log("button clicked");
    printQuery();
    // getArticles();
  }

  // useEffect(() => {
  //   axios
  //     .get(
  //       //keyword used to filter is technology 
  //       //`https://newsapi.org/v2/everything?q=technology&from=2023-06-12&to=2023-06-12&sortBy=popularity&apiKey=${newsAPIKey}`

  //       //keyword used to filter is internet - articles here are more relevant i guess
  //       `https://newsapi.org/v2/everything?q=internet&from=2023-06-12&to=2023-06-12&sortBy=popularity&apiKey=${newsAPIKey}`
  //     )
  //     .then(response => {
  //       const { articles } = response.data;
  //       setPosts(articles.slice(0, 10)); // displays only top 10
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }, []);
  useEffect(() => {
    const fetchArticles = async () => {
      const articles = await getArticles();
      setPosts(articles);
    };
  
    fetchArticles();
  }, []);

  return (
    <div>
      <br /> <br/>
      <h2>Tech Articles</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <div className="article-container">
              <img
                src={post.urlToImage}
                alt={post.title}
                className="article-image"
              />
              <h3 className="article-title">
                <a href={post.url} target="_blank" rel="noopener noreferrer">
                  {post.title}
                </a>
              </h3>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tech;
