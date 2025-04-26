pragma solidity ^0.8.0;

contract TaskManager {
    enum TaskStatus { Open, Completed }

    struct Task {
        address owner;
        uint256 bounty;
        TaskStatus status;
        string description;
    }

    struct Submission {
        address submitter;
        string proof;
        bool approved;
    }

    mapping(uint256 => Task) public tasks;
    mapping(uint256 => Submission[]) public submissions;
    uint256 public taskCount;

    event TaskCreated(uint256 taskId, address owner, uint256 bounty);
    event SubmissionCreated(uint256 taskId, address submitter);
    event TaskCompleted(uint256 taskId, address submitter);

    constructor() payable {}

    function createTask(string memory _description) external payable {
        require(msg.value > 0, "Bounty must be > 0");
        
        tasks[taskCount] = Task({
            owner: msg.sender,
            bounty: msg.value,
            status: TaskStatus.Open,
            description: _description
        });

        emit TaskCreated(taskCount, msg.sender, msg.value);
        taskCount++;
    }

    function submitTask(uint256 _taskId, string memory _proof) external {
        Task storage task = tasks[_taskId];
        require(task.status == TaskStatus.Open, "Task not open");
        
        submissions[_taskId].push(Submission({
            submitter: msg.sender,
            proof: _proof,
            approved: false
        }));

        emit SubmissionCreated(_taskId, msg.sender);
    }

    function approveSubmission(uint256 _taskId, uint256 _submissionId) external {
        Task storage task = tasks[_taskId];
        require(msg.sender == task.owner, "Not task owner");
        require(task.status == TaskStatus.Open, "Task not open");

        Submission storage submission = submissions[_taskId][_submissionId];
        submission.approved = true;
        task.status = TaskStatus.Completed;
        
        (bool sent, ) = submission.submitter.call{value: task.bounty}("");
        require(sent, "Failed to send bounty");

        emit TaskCompleted(_taskId, submission.submitter);
    }
}