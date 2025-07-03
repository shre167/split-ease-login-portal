import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { db, auth } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  getDocs,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import AIAssistant from './AiAssisstant';
import BottomNavigation from './BottomNavigation';
import DashboardHeader from './DashboardHeader';

type Group = {
  id: string;
  name: string;
  code: string;
  members: string[];
  balance: number;
};

const Dashboard = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [inviteModalGroup, setInviteModalGroup] = useState<Group | null>(null);
  const [inviteInput, setInviteInput] = useState('');
  const [userEmail, setUserEmail] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const identifier = user?.email || user?.phoneNumber;
      if (identifier) {
        setUserEmail(identifier);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
  if (!userEmail) return; // 🔒 Prevent invalid Firestore query

  const q = query(
    collection(db, 'groups'),
    where('members', 'array-contains', userEmail)
  );

  const unsubscribeGroups = onSnapshot(q, (snapshot) => {
    const userGroups = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Group[];
    setGroups(userGroups);
  });

  return () => unsubscribeGroups(); // ✅ Clean up listener
}, [userEmail]); // 🔁 Re-run when email is ready


  const generateGroupCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name.');
      return;
    }

    if (!userEmail) {
      alert("User email not found. Please login again.");
      return;
    }

    const code = generateGroupCode();
    const name = groupName.trim();

    const groupData = {
      name,
      code,
      balance: 0,
      members: [userEmail],
    };

    try {
      const docRef = await addDoc(collection(db, 'groups'), groupData);

      const newGroup: Group = {
        id: docRef.id,
        ...groupData,
      };

      setGroupName('');
      setIsModalOpen(false);

      setTimeout(() => {
        setInviteModalGroup(newGroup);
      }, 200);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  const handleJoinGroup = async () => {
    const codeTrimmed = joinCode.trim().toUpperCase();
    const q = query(collection(db, 'groups'), where('code', '==', codeTrimmed));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const groupDoc = querySnapshot.docs[0];
      const groupRef = doc(db, 'groups', groupDoc.id);
      await updateDoc(groupRef, {
        members: arrayUnion(userEmail),
      });
      setJoinCode('');
      setIsJoinModalOpen(false);
    } else {
      alert('Invalid group code.');
    }
  };

  const handleAddMember = async () => {
    if (!inviteModalGroup || !inviteInput.trim()) return;
    const groupRef = doc(db, 'groups', inviteModalGroup.id);
    await updateDoc(groupRef, {
      members: arrayUnion(inviteInput.trim()),
    });
    setInviteModalGroup(null);
    setInviteInput('');
    alert('Member added successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <DashboardHeader userName="Shreya" />

      <div className="max-w-4xl mx-auto px-4 mt-[40px]">
        {/* Group List */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Your Groups</h2>
            <span className="text-sm text-gray-500">{groups.length} groups</span>
          </div>

          <div className="space-y-4">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/group/${group.id}`)}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">
                    👥
                  </div>
                  <div>
                    <p className="font-semibold">{group.name}</p>
                    <p className="text-sm text-gray-500">{group.members.length} members</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-md text-gray-800">
                      ₹{Math.abs(group.balance).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {group.balance >= 0 ? 'you are owed' : 'you owe'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent navigating when plus icon is clicked
                      setInviteModalGroup(group);
                    }}
                    className="text-gray-600 hover:text-black"
                  >
                    <Plus />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-x-4 mt-6">
          <Button onClick={() => setIsModalOpen(true)}>Create Group</Button>
          <Button variant="outline" onClick={() => setIsJoinModalOpen(true)}>
            Join Group
          </Button>
        </div>

        <div className="my-8">
          <AIAssistant />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 w-full">
        <BottomNavigation />
      </div>

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Create New Group</h2>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup}>Create</Button>
            </div>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md relative">
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Join a Group</h2>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="Enter group code"
              className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsJoinModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleJoinGroup}>Join</Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteModalGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-md relative">
            <button
              onClick={() => setInviteModalGroup(null)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">Invite to {inviteModalGroup.name}</h2>
            <p className="text-sm text-gray-600 mb-2">
              Invite Code: <strong>{inviteModalGroup.code}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Invite Link: <strong>https://splitease.app/join/{inviteModalGroup.code}</strong>
            </p>
            <input
              type="text"
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              placeholder="Email or Mobile Number"
              className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setInviteModalGroup(null)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember}>Add Member</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

