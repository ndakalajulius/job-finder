import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { getAuth } from "firebase/auth";
import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function ProfileScreen() {
  const auth = getAuth();
  const user = auth.currentUser;
  const [name, setName] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  useEffect(() => {
    if (user) loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setName(docSnap.data().name);
        setResumeLink(docSnap.data().resumeLink);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const saveProfile = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), { name, resumeLink });
      alert("Profile updated!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  return (
    <View>
      <Text>Name:</Text>
      <TextInput value={name} onChangeText={setName} />
      <Text>Resume Link:</Text>
      <TextInput value={resumeLink} onChangeText={setResumeLink} />
      <Button title="Save Profile" onPress={saveProfile} />
    </View>
  );
}
