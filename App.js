import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, View, FlatList } from "react-native";
import styles from "./styles";
import renderArticleItem from "./components/renderArticleItem";
import filterForUniqueArticles from "./components/filterForUniqueArticles";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasErrored, setHasApiError] = useState(false);
  const [lastPageReached, setLastPageReached] = useState(false);

  const getNews = async () => {
    if (lastPageReached) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=986af79db75b4566a558b7ac75d44da6&page=${pageNumber}`
      );
      const jsonData = await response.json();
      const newArticleList = filterForUniqueArticles(
        articles.concat(jsonData.articles)
      );

      const hasMoreArticles = jsonData.articles.length > 0;
      if (hasMoreArticles) {
        const newArticleList = filterForUniqueArticles(
          articles.concat(jsonData.articles)
        );
        setArticles(newArticleList);
        setPageNumber(pageNumber + 1);
      } else {
        setLastPageReached(true);
      }

      setArticles(newArticleList);
      setPageNumber(pageNumber + 1);
      setLoading(false);
    } catch (error) {
      setHasApiError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    getNews();
  }, [articles]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" loading={loading} />
      </View>
    );
  }

  if (hasErrored) {
    return (
      <View style={styles.container}>
        <Text>Error =(</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Articles Count:</Text>
        <Text style={styles.info}>{articles.length}</Text>
      </View>
      <FlatList
        data={articles}
        renderItem={renderArticleItem}
        onEndReached={getNews}
        onEndReachedThreshold={1}
        keyExtractor={(item) => item.title}
        key={(item) => item.title}
        ListFooterComponent={
          lastPageReached ? (
            <Text>No more articles</Text>
          ) : (
            <ActivityIndicator size="large" loading={loading} />
          )
        }
      />
    </View>
  );
}
