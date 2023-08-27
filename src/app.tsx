import { Button, ChakraProvider, Input, useDisclosure } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Spinner,
	Checkbox
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

import './app.css';
import { useEffect, useState } from 'preact/hooks';
import { CreateTaskModal } from './components/createTaskModal';
import { UpdateTaskModal } from './components/updateTaskModal';
import { DeleteTaskModal } from './components/deleteTaskModal';

interface Task {
	id: string;
	title: string;
	content: string;
	expiration: string;
	status: string;
}

export function App() {
	const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

	const [searchValue, setSearchValue] = useState<string>('');
	const [tasks, setTasks] = useState<Task[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
	const [targetTask, setTargetTask] = useState<Task>();
	const [isCheckBoxChecked, setIsCheckBoxChecked] = useState<boolean>();
	const [isLoading, setIsLoading] = useState(false);
	const {
		isOpen: createTaskModalIsOpen,
		onOpen: createTaskModalOnOpen,
		onClose: createTaskModalOnClose
	} = useDisclosure();
	const {
		isOpen: updateTaskModalIsOpen,
		onOpen: updateTaskModalOnOpen,
		onClose: updateTaskModalOnClose
	} = useDisclosure();
	const {
		isOpen: deleteTaskModalIsOpen,
		onOpen: deleteTaskModalOnOpen,
		onClose: deleteTaskModalOnClose
	} = useDisclosure();

	const handleSearchValueChanged = (event: any) => {
		setSearchValue(event.target.value);
	};

	const updateTaskStatus = async (task: Task) => {
		setIsLoading(true);
		const { id, title, content, expiration, status } = task;
		try {
			const url = `${API_ENDPOINT}/task/${id}`;
			const updatedTask = {
				title,
				content,
				expiration,
				status: status === 'TODO' ? 'DONE' : 'TODO'
			};
			await fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': import.meta.env.VITE_API_KEY
				},
				body: JSON.stringify(updatedTask)
			});
			setIsCheckBoxChecked(!isCheckBoxChecked);
		} catch (e) {
			console.log('error', e);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const fetchTasks = async () => {
			setIsLoading(true);
			try {
				const url = `${API_ENDPOINT}/tasks`;
				const res = await fetch(url, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						'x-api-key': import.meta.env.VITE_API_KEY
					}
				});
				const json = await res.json();
				setTasks(json);
			} catch (e) {
				console.log('error', e);
			} finally {
				setIsLoading(false);
			}
		};
		fetchTasks();
	}, [
		createTaskModalIsOpen,
		updateTaskModalIsOpen,
		deleteTaskModalIsOpen,
		isCheckBoxChecked
	]);

	useEffect(() => {
		const filteredTasks = tasks.filter((task) => {
			return task.title.includes(searchValue);
		});
		setFilteredTasks(filteredTasks);
	}, [tasks, searchValue]);

	return (
		<ChakraProvider>
			{!isLoading ? (
				<>
					<Text fontSize="3xl" mb={7}>
						Class Method TODO App
					</Text>
					<Button
						colorScheme="blue"
						mb={5}
						size="md"
						onClick={createTaskModalOnOpen}
					>
						タスクを作成
					</Button>

					<Input
						variant="flushed"
						placeholder="タスクのタイトルで検索"
						onChange={handleSearchValueChanged}
						mb="10"
					/>

					<CreateTaskModal
						apiEndpoint={API_ENDPOINT}
						isOpen={createTaskModalIsOpen}
						onClose={createTaskModalOnClose}
						setIsLoading={setIsLoading}
					/>
					<TableContainer mb={10}>
						<Table variant="simple">
							<Thead>
								<Tr>
									<Th>ステータス</Th>
									<Th>タイトル</Th>
									<Th>内容</Th>
									<Th>期限</Th>
									<Th>編集</Th>
									<Th>削除</Th>
								</Tr>
							</Thead>
							<Tbody>
								{filteredTasks.map((task: Task) => (
									<Tr>
										{targetTask && (
											<>
												<UpdateTaskModal
													apiEndpoint={API_ENDPOINT}
													isOpen={updateTaskModalIsOpen}
													onClose={updateTaskModalOnClose}
													task={targetTask}
													setIsLoading={setIsLoading}
												/>
												<DeleteTaskModal
													apiEndpoint={API_ENDPOINT}
													isOpen={deleteTaskModalIsOpen}
													onClose={deleteTaskModalOnClose}
													task={targetTask}
													setIsLoading={setIsLoading}
												/>
											</>
										)}
										<Td>
											<Checkbox
												size="lg"
												colorScheme="blue"
												isChecked={task.status === 'DONE'}
												onChange={() => {
													updateTaskStatus(task);
												}}
											/>
										</Td>
										<Td>{task.title}</Td>
										<Td>{task.content}</Td>
										<Td>{task.expiration}</Td>
										<Td>
											<EditIcon
												onClick={() => {
													setTargetTask(task);
													updateTaskModalOnOpen();
												}}
											/>
										</Td>
										<Td>
											<DeleteIcon
												onClick={() => {
													setTargetTask(task);
													deleteTaskModalOnOpen();
												}}
											/>
										</Td>
									</Tr>
								))}
							</Tbody>
						</Table>
					</TableContainer>
				</>
			) : (
				<Spinner />
			)}
		</ChakraProvider>
	);
}
