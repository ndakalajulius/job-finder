import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function SavedJobsScreen() {
  const [savedJobs, setSavedJobs] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const jobs = JSON.parse(await AsyncStorage.getItem('savedJobs')) || [];
        setSavedJobs(jobs);
      } catch (error) {
        console.error('Error fetching saved jobs:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchSavedJobs);
    return unsubscribe;
  }, [navigation]);

  const removeJob = async (jobId) => {
    try {
      const updatedJobs = savedJobs.filter((job) => job.job_id !== jobId);
      await AsyncStorage.setItem('savedJobs', JSON.stringify(updatedJobs));
      setSavedJobs(updatedJobs);
    } catch (error) {
      console.error('Error removing job:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.job_id}
        renderItem={({ item }) => (
          <Card style={styles.jobCard}>
            <Card.Title title={item.job_title} subtitle={item.job_employment_type} />
            <Card.Content>
              <Text>{item.job_city}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('JobDetails', { job: item })}>View</Button>
              <Button onPress={() => removeJob(item.job_id)}>Remove</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text>No saved jobs.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  jobCard: { marginBottom: 10 },
});
