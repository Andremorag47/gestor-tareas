package com.portafolio.tareas.gestor_tareas.service;

import com.portafolio.tareas.gestor_tareas.model.Tarea;
import com.portafolio.tareas.gestor_tareas.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    // Guardar una nueva tarea
    public Tarea guardarTarea(Tarea tarea) {
        return tareaRepository.save(tarea);
    }

    // Obtener todas las tareas
    public List<Tarea> obtenerTareas() {
        return tareaRepository.findAll();
    }

    // Obtener una tarea por ID
    public Tarea obtenerTareaPorId(Long id) {
        Optional<Tarea> tarea = tareaRepository.findById(id);
        return tarea.orElse(null); // Si no existe, regresa null
    }

    // Eliminar una tarea por ID
    public void eliminarTarea(Long id) {
        tareaRepository.deleteById(id);
    }

    // Actualizar una tarea
    public Tarea actualizarTarea(Long id, Tarea tarea) {
        if (tareaRepository.existsById(id)) {
            tarea.setId(id); // Asegurarse de que el ID de la tarea sea correcto
            return tareaRepository.save(tarea);
        }
        return null; // Si no existe la tarea, retorna null
    }

    // Marcar una tarea como completada
    public Tarea marcarCompletada(Long id) {
        Optional<Tarea> tarea = tareaRepository.findById(id);
        if (tarea.isPresent()) {
            tarea.get().setCompletada(true);
            return tareaRepository.save(tarea.get());
        }
        return null; // Si no existe la tarea, retorna null
    }

    // Desmarcar una tarea como incompleta
    public Tarea desmarcarCompletada(Long id) {
        Optional<Tarea> tarea = tareaRepository.findById(id);
        if (tarea.isPresent()) {
            tarea.get().setCompletada(false);
            return tareaRepository.save(tarea.get());
        }
        return null; // Si no existe la tarea, retorna null
    }
}
