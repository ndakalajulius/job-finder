import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function JobDetailsScreen({ route }) {
  const { job } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{job.job_title}</Text>
      <Text>{job.job_description}</Text>
      <Text>{job.job_employment_type} - {job.job_city}</Text>
      <Button title="Apply Now" onPress={() => alert("Application submitted!")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "bold" },
});
