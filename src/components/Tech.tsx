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

  /**useEffect(() => {
    axios
      .get(
        //keyword used to filter is technology 
        `https://newsapi.org/v2/everything?q=technology&from=2023-06-12&to=2023-06-12&sortBy=popularity&apiKey=${newsAPIKey}`

        //keyword used to filter is internet
        //`https://newsapi.org/v2/everything?q=internet&from=2023-06-12&to=2023-06-12&sortBy=popularity&apiKey=${newsAPIKey}`
      )
      .then(response => {
        const { articles } = response.data;
        setPosts(articles.slice(0, 12)); // displays only top 10
      })
      .catch(error => {
        console.error(error);
      }); */
  }, []);

  const openPreview = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="App">
      <br />
      <h2 className="tech-title">Technology + AI</h2>
      <h3 className = "tech-intro">Stay up to date with the latest technology articles below</h3>
      <div className="Tech">
        <div className="Tech-list">
          {posts.map(post => (
            <div className="article-container" key={post.id}>
              <img
                src={post.urlToImage}
                alt={post.title}
                className="article-image"
              />
              <h3 className="article-title">{post.title}</h3>
              <button
                className="read-more-button"
                onClick={() => openPreview(post.url)}
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tech;
