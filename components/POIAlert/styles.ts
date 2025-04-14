import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(0, 150, 136, 0.9)",
    borderRadius: 15,
    padding: 15,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  distance: {
    color: "#FFF",
    fontSize: 14,
    marginLeft: 8,
    fontWeight: "500",
  },
  description: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  buttonContainer: {
    alignItems: "flex-start",
  },
  button: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#009688",
    fontWeight: "bold",
    marginRight: 5,
  },
});
