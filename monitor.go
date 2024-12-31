package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/go-ping/ping"
	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/load"
	"github.com/shirou/gopsutil/mem"
)

// SystemStatus 结构体，用于封装返回的系统资源数据
type SystemStatus struct {
	CPUUsage      float64             `json:"cpu_usage"`
	MemoryUsage   float64             `json:"memory_usage"`
	DiskUsage     float64             `json:"disk_usage"`
	Load1Min      float64             `json:"load_1min"`
	Load5Min      float64             `json:"load_5min"`
	Load15Min     float64             `json:"load_15min"`
	NetworkStatus map[string]bool    `json:"network_status"`
	URLStatus     map[string]bool    `json:"url_status"`
}

// PingHost 检查指定的 IP 是否能被 Ping 通
func PingHost(ip string) bool {
	pinger, err := ping.NewPinger(ip)
	if err != nil {
		log.Printf("Error creating pinger for %s: %v", ip, err)
		return false
	}
	pinger.Count = 3
	pinger.Timeout = 2 * time.Second
	err = pinger.Run()
	if err != nil {
		log.Printf("Ping error: %v", err)
		return false
	}

	if pinger.Statistics().PacketsRecv > 0 {
		return true
	}

	return false
}

// CheckURL 检查指定的 URL 是否能访问
func CheckURL(url string) bool {
	client := http.Client{
		Timeout: 2 * time.Second, // 设置超时时间为 2 秒
	}

	resp, err := client.Get(url)
	if err != nil {
		log.Printf("Error accessing URL %s: %v", url, err)
		return false
	}
	defer resp.Body.Close()

	// 判断 HTTP 状态码是否为 2xx
	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return true
	}

	return false
}

// GetSystemStatus 获取系统资源使用情况并返回结构体
func GetSystemStatus(ips []string, urls []string) (*SystemStatus, error) {
	// 获取 CPU 使用百分比
	cpuPercent, err := cpu.Percent(time.Second, false)
	if err != nil {
		return nil, fmt.Errorf("Error getting CPU percent: %v", err)
	}

	// 获取内存使用百分比
	virtualMemory, err := mem.VirtualMemory()
	if err != nil {
		return nil, fmt.Errorf("Error getting virtual memory: %v", err)
	}

	// 获取磁盘使用百分比
	usage, err := disk.Usage("/")
	if err != nil {
		return nil, fmt.Errorf("Error getting disk usage: %v", err)
	}

	// 获取系统负载情况
	loadAvg, err := load.Avg()
	if err != nil {
		return nil, fmt.Errorf("Error getting system load: %v", err)
	}

	// 获取多个 IP 的网络可达性
	networkStatus := make(map[string]bool)
	for _, ip := range ips {
		networkStatus[ip] = PingHost(ip)
	}

	// 获取多个 URL 的访问状态
	urlStatus := make(map[string]bool)
	for _, url := range urls {
		urlStatus[url] = CheckURL(url)
	}

	status := &SystemStatus{
		CPUUsage:      cpuPercent[0],
		MemoryUsage:   virtualMemory.UsedPercent,
		DiskUsage:     usage.UsedPercent,
		Load1Min:      loadAvg.Load1,
		Load5Min:      loadAvg.Load5,
		Load15Min:     loadAvg.Load15,
		NetworkStatus: networkStatus,
		URLStatus:     urlStatus,
	}

	return status, nil
}

// HandleStatus 请求处理器，返回系统资源信息
func HandleStatus(w http.ResponseWriter, r *http.Request) {
	// 获取查询参数中的 IP 地址和 URL 列表
	ipsParam := r.URL.Query().Get("ips")
	urlsParam := r.URL.Query().Get("urls")

	if ipsParam == "" && urlsParam == "" {
		http.Error(w, "Missing 'ips' or 'urls' query parameters", http.StatusBadRequest)
		return
	}

	// 分割 IP 地址，支持多个 IP 地址，以逗号分隔
	ips := strings.Split(ipsParam, ",")
	// 分割 URL 地址，支持多个 URL 地址，以逗号分隔
	urls := strings.Split(urlsParam, ",")

	status, err := GetSystemStatus(ips, urls)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error fetching system status: %v", err), http.StatusInternalServerError)
		return
	}

	// 设置响应类型为 JSON
	w.Header().Set("Content-Type", "application/json")

	// 返回 JSON 格式的数据
	if err := json.NewEncoder(w).Encode(status); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding JSON response: %v", err), http.StatusInternalServerError)
	}
}

func main() {
	// 设置 HTTP 路由
	http.HandleFunc("/status", HandleStatus)

	// 启动 HTTP 服务器
	port := ":8080"
	fmt.Printf("Starting HTTP server on %s...\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}
