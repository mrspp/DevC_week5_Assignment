import React from "react";
import { Card, Button, Icon } from "react-native-elements";
import moment from "moment";
import styles from "../styles";

import { Text, View, Linking } from "react-native";

const onPress = (url) => {
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log(`Don't know how to open URL: ${url}`);
    }
  });
};

const renderArticleItem = ({ item }) => {
  return (
    <Card title={item.title} image={{ uri: item.urlToImage }}>
      <View style={styles.row}>
        <Text style={styles.label}>Source</Text>
        <Text style={styles.info}>{item.source.name}</Text>
      </View>
      <Text style={{ marginBottom: 10 }}>{item.content}</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Published</Text>
        <Text style={styles.info}>
          {moment(item.publishedAt).startOf("hour").fromNow()}
        </Text>
      </View>
      <Button
        icon={<Icon />}
        title="Read more"
        backgroundColor="#03A9F4"
        onPress={() => onPress(item.url)}
      />
    </Card>
  );
};

export default renderArticleItem;
