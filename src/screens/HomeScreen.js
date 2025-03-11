import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Card, Button } from "react-native-paper";

const API_KEY = "YOUR_JSEARCH_API_KEY";
const API_URL = `https://jsearch.p.rapidapi.com/search`;

export default function HomeScreen() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchJobs("developer");
  }, []);

  const fetchJobs = async (searchTerm) => {
    try {
      const response = await axios.get(API_URL, {
        headers: { "X-RapidAPI-Key": API_KEY },
        params: { query: searchTerm, num_pages: 1 },
      });
      setJobs(response.data.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const saveJob = async (job) => {
    try {
      const savedJobs = JSON.parse(await AsyncStorage.getItem("savedJobs")) || [];
      await AsyncStorage.setItem("savedJobs", JSON.stringify([...savedJobs, job]));
      alert("Job saved!");
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search jobs..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => fetchJobs(query)}
      />
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.job_id}
        renderItem={({ item }) => (
          <Card style={styles.jobCard}>
            <Card.Title title={item.job_title} subtitle={item.job_employment_type} />
            <Card.Content>
              <Text>{item.job_city}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate("JobDetails", { job: item })}>View</Button>
              <Button onPress={() => saveJob(item)}>Save</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  searchBox: { height: 40, borderWidth: 1, paddingHorizontal: 10, marginBottom: 10 },
  jobCard: { marginBottom: 10 },
});
