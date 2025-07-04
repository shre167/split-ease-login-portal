// src/pages/Dashboard.tsx

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
import UpiQRModal from '@/pages/UpiQRModal';
import FinanceCards from './FinanceCards';

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
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const identifier = user?.email || user?.phoneNumber;
      if (identifier) setUserEmail(identifier);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

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

    return () => unsubscribeGroups();
  }, [userEmail]);

  const totalOwe = groups
    .map((g) => (g.balance < 0 ? g.balance : 0))
    .reduce((acc, val) => acc + val, 0);
  const totalOwed = groups
    .map((g) => (g.balance > 0 ? g.balance : 0))
    .reduce((acc, val) => acc + val, 0);

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return alert('Please enter a group name.');
    if (!userEmail) return alert('User email not found. Please login again.');

    const code = Array.from({ length: 6 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[
        Math.floor(Math.random() * 36)
      ]
    ).join('');

    const groupData = {
      name: groupName.trim(),
      code,
      balance: 0,
      members: [userEmail],
    };

    try {
      const docRef = await addDoc(collection(db, 'groups'), groupData);
      setGroupName('');
      setIsModalOpen(false);
      setTimeout(() => {
        setInviteModalGroup({ id: docRef.id, ...groupData });
      }, 200);
    } catch (err) {
      alert('Error creating group');
      console.error(err);
    }
  };

  const handleJoinGroup = async () => {
    const q = query(
      collection(db, 'groups'),
      where('code', '==', joinCode.trim().toUpperCase())
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await updateDoc(doc(db, 'groups', snapshot.docs[0].id), {
        members: arrayUnion(userEmail),
      });
      setJoinCode('');
      setIsJoinModalOpen(false);
    } else alert('Invalid group code.');
  };

  const handleAddMember = async () => {
    if (!inviteModalGroup || !inviteInput.trim()) return;
    await updateDoc(doc(db, 'groups', inviteModalGroup.id), {
      members: arrayUnion(inviteInput.trim()),
    });
    setInviteInput('');
    setInviteModalGroup(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <DashboardHeader userName="Shreya" />
      <div className="max-w-4xl mx-auto px-4 mt-10">
        <FinanceCards totalOwe={totalOwe} totalOwed={totalOwed} />

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
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg">👥</div>
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
                      e.stopPropagation();
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

      <BottomNavigation />
      <UpiQRModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Modals */}
      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-3 right-4 text-xl text-gray-600 hover:text-black">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-center">Create Group</h2>
            <input
              type="text"
              className="w-full border p-2 rounded mb-4"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup}>Create</Button>
            </div>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <button onClick={() => setIsJoinModalOpen(false)} className="absolute top-3 right-4 text-xl text-gray-600 hover:text-black">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-center">Join Group</h2>
            <input
              type="text"
              className="w-full border p-2 rounded mb-4 uppercase"
              placeholder="Group code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsJoinModalOpen(false)}>Cancel</Button>
              <Button onClick={handleJoinGroup}>Join</Button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {inviteModalGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full relative">
            <button onClick={() => setInviteModalGroup(null)} className="absolute top-3 right-4 text-xl text-gray-600 hover:text-black">&times;</button>
            <h2 className="text-xl font-bold mb-4 text-center">Invite to {inviteModalGroup.name}</h2>
            <p className="text-sm mb-1">Invite Code: <strong>{inviteModalGroup.code}</strong></p>
            <p className="text-sm mb-4">Link: <strong>https://splitease.app/join/{inviteModalGroup.code}</strong></p>
            <input
              type="text"
              className="w-full border p-2 rounded mb-4"
              placeholder="Email or Phone"
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setInviteModalGroup(null)}>Cancel</Button>
              <Button onClick={handleAddMember}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
